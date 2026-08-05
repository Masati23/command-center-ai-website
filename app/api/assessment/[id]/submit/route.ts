import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scoreAssessment } from "@/lib/scoring";
import { recommendProducts } from "@/lib/recommendations";
import { calculatePricing, determineSalesPath } from "@/lib/pricing";
import type { FullAssessmentAnswers } from "@/lib/assessment-types";
import { sendProposalEmails } from "@/lib/notifications";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Finalizes an assessment: scores it, generates recommendations and a
 * pricing estimate, creates/links the Customer record, and generates a
 * Proposal. This is the one place all of Phase 1's "create X record after
 * assessment completion" requirements come together.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (isRateLimited(getClientIp(req), 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const assessment = await db.assessment.findUnique({ where: { id: params.id } });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (assessment.status === "SUBMITTED") {
    return NextResponse.json({ error: "Already submitted" }, { status: 409 });
  }

  const answers: FullAssessmentAnswers = {
    businessProfile: (assessment.businessProfile as any) ?? undefined,
    customerFlow: (assessment.customerFlow as any) ?? undefined,
    salesFollowUp: (assessment.salesFollowUp as any) ?? undefined,
    appointmentsService: (assessment.appointmentsService as any) ?? undefined,
    operationsAutomation: (assessment.operationsAutomation as any) ?? undefined,
    softwareIntegrations: (assessment.softwareIntegrations as any) ?? undefined,
    goalsTimelineBudget: (assessment.goalsTimelineBudget as any) ?? undefined,
  };

  if (!answers.businessProfile?.email || !answers.businessProfile?.fullName) {
    return NextResponse.json({ error: "Business profile is incomplete." }, { status: 400 });
  }

  // 1. Score
  const scores = scoreAssessment(answers);

  // 2. Recommend
  const catalog = await db.product.findMany({ where: { status: "ACTIVE" } });
  const recommendations = recommendProducts(answers, catalog);

  // 3. Price
  const bundleRules = await db.bundleRule.findMany();
  const pricingConfig = await db.pricingConfig.findMany();
  const pricing = calculatePricing(answers, recommendations, scores.complexityTier, bundleRules, pricingConfig);

  const integrationCount = answers.softwareIntegrations?.systemsInUse?.length ?? 0;
  const hasCustomWorkflowFlags = !!(
    answers.softwareIntegrations?.needsDataMigration || answers.softwareIntegrations?.needsCustomDashboards
  );
  const salesPath = determineSalesPath(scores.complexityTier, integrationCount, hasCustomWorkflowFlags);

  // 4. Create or reuse the Customer record
  const customer = await db.customer.upsert({
    where: { email: answers.businessProfile.email },
    update: {
      name: answers.businessProfile.fullName,
      businessName: answers.businessProfile.businessName,
      phone: answers.businessProfile.phone,
    },
    create: {
      name: answers.businessProfile.fullName,
      businessName: answers.businessProfile.businessName,
      email: answers.businessProfile.email,
      phone: answers.businessProfile.phone,
    },
  });

  // 5. Persist score + recommendations + finalize the assessment
  await db.$transaction([
    db.assessment.update({
      where: { id: assessment.id },
      data: { status: "SUBMITTED", submittedAt: new Date(), customerId: customer.id },
    }),
    db.score.create({
      data: {
        assessmentId: assessment.id,
        ...scores,
      },
    }),
    db.recommendation.createMany({
      data: recommendations.map((r) => ({
        assessmentId: assessment.id,
        productId: r.product.id,
        priorityTier: r.priorityTier,
        weightScore: r.weightScore,
      })),
    }),
  ]);

  // 6. Generate the proposal (snapshot pricing + recommendations at this
  // moment — future product price changes shouldn't silently alter a
  // proposal someone already received).
  const proposal = await db.proposal.create({
    data: {
      assessmentId: assessment.id,
      customerId: customer.id,
      path: salesPath,
      recommendedProductsSnapshot: recommendations.map((r) => ({
        id: r.product.id,
        name: r.product.name,
        priorityTier: r.priorityTier,
        basePrice: r.product.basePrice,
        monthlySupport: r.product.monthlySupport,
        buildTimeDays: r.product.buildTimeDays,
      })),
      pricingSnapshot: pricing as unknown as object,
    },
  });

  await db.eventLog.create({
    data: {
      type: "assessment_submitted",
      refId: assessment.id,
      metadata: { customerId: customer.id, proposalId: proposal.id, salesPath, complexityTier: scores.complexityTier },
    },
  });

  await db.eventLog.create({
    data: {
      type: "proposal_created",
      refId: proposal.id,
      metadata: { assessmentId: assessment.id, salesPath },
    },
  });

  // 7. Email the customer their summary and notify the Command Center AI
  // team. Fire-and-forget-ish: awaited so failures are logged, but a Resend
  // hiccup should never block the customer from reaching their results page
  // (sendProposalEmails already catches its own errors internally).
  await sendProposalEmails({
    proposalId: proposal.id,
    assessmentId: assessment.id,
    customerName: customer.name,
    customerEmail: customer.email,
    businessName: customer.businessName ?? undefined,
    overallReadinessScore: scores.overallReadinessScore,
    finalEstimateCents: pricing.finalEstimateCents,
    isCustomPackage: pricing.isCustomPackage,
    salesPath,
    recommendedProductNames: recommendations
      .filter((r) => r.priorityTier !== "optional_upgrade")
      .map((r) => r.product.name),
  });

  return NextResponse.json({ id: assessment.id, proposalId: proposal.id, salesPath });
}
