import type { Product } from "@prisma/client";
import type { FullAssessmentAnswers } from "./assessment-types";

export type PriorityTier = "recommended_first" | "recommended_next" | "optional_upgrade";

export interface ProductRecommendation {
  product: Product;
  weightScore: number;
  priorityTier: PriorityTier;
}

/**
 * Rule-based tag matching — deterministic and explainable, per the approved
 * plan (no ML in v1). Each answer maps to a set of tags with a weight; each
 * product carries tags (see prisma/seed.ts); recommendation weight = sum of
 * matched tag weights.
 *
 * TODO(admin-config): externalize this answer->tag weight map into the DB
 * (a JSON column on PricingConfig, or its own table) so admins can adjust
 * matching without a deploy. Hardcoded for Phase 1.
 */
function deriveTagWeights(a: FullAssessmentAnswers): Record<string, number> {
  const weights: Record<string, number> = {};
  const bump = (tag: string, amount: number) => {
    weights[tag] = (weights[tag] ?? 0) + amount;
  };

  const flow = a.customerFlow;
  if (flow) {
    if (!flow.afterHoursCoverage) bump("after-hours", 8);
    if (!flow.missedCallFollowUp) bump("missed-call", 10);
    if (flow.contactChannels?.includes("phone")) bump("phone-answering", 5);
    if (flow.contactChannels?.includes("text")) bump("sms", 4);
    if (flow.contactChannels?.includes("website form")) bump("website-support", 4);
    if (flow.responseSpeed === "1+_days" || flow.responseSpeed === "same_day") bump("lead-generation", 5);
  }

  const sales = a.salesFollowUp;
  if (sales) {
    if (!sales.usesCrm) bump("crm", 10);
    if (!sales.followUpAutomated) bump("follow-up", 10);
    if (sales.proposalsManual) bump("proposal-generation", 8);
    if (!sales.lostLeadsTracked) bump("lead-generation", 6);
  }

  const appt = a.appointmentsService;
  if (appt) {
    if (appt.schedulesAppointments && !appt.usesCalendarPlatform) bump("appointment-booking", 10);
    if (appt.schedulesAppointments && !appt.sendsReminders) bump("reminders", 6);
    if (!appt.followsUpMissedAppointments) bump("follow-up", 6);
    if (appt.repetitiveFaqBurden) bump("faq-burden", 8);
    if (appt.needs24_7) bump("after-hours", 6);
    if (appt.needsBilingual) bump("bilingual", 10);
  }

  const ops = a.operationsAutomation;
  if (ops) {
    const tagMap: Record<string, string> = {
      "Lead generation": "lead-generation",
      "Lead qualification": "lead-qualification",
      "Website customer support": "website-support",
      "Appointment booking": "appointment-booking",
      "Phone answering": "phone-answering",
      "Missed-call text back": "missed-call",
      "Email follow-up": "email",
      "SMS follow-up": "sms",
      "Proposal generation": "proposal-generation",
      "Estimate generation": "estimate-generation",
      "Review requests": "reputation",
      "CRM updates": "crm",
      "Reporting": "reporting",
      "Invoice reminders": "operational-efficiency",
      "Internal employee assistance": "internal-support",
      "Document processing": "internal-support",
      "Workflow automation": "workflow-automation",
    };
    for (const process of ops.processesToImprove ?? []) {
      const tag = tagMap[process];
      if (tag) bump(tag, 12); // explicit selection is the strongest signal
    }
  }

  const si = a.softwareIntegrations;
  if (si) {
    if (si.needsCustomDashboards || si.needsCustomReports) bump("dashboards", 8);
    if (si.multiLocation) bump("multi-location", 6);
    if (!si.systemsInUse?.length) bump("crm", 4);
  }

  return weights;
}

export function recommendProducts(
  answers: FullAssessmentAnswers,
  catalog: Product[]
): ProductRecommendation[] {
  const tagWeights = deriveTagWeights(answers);

  const scored = catalog
    .filter((p) => p.status === "ACTIVE")
    .map((product) => {
      const tags = (product.tags as string[]) ?? [];
      const weightScore = tags.reduce((sum, tag) => sum + (tagWeights[tag] ?? 0), 0);
      // Core products get a baseline boost so the 4 backbone products are
      // always evaluated first, per the approved plan.
      const baseline = product.category === "CORE" ? 10 : 0;
      return { product, weightScore: weightScore + baseline };
    })
    .filter((r) => r.weightScore > 0)
    .sort((a, b) => b.weightScore - a.weightScore);

  return scored.map((r, i): ProductRecommendation => {
    let priorityTier: PriorityTier;
    if (i < 2) priorityTier = "recommended_first";
    else if (i < 5) priorityTier = "recommended_next";
    else priorityTier = "optional_upgrade";
    return { ...r, priorityTier };
  });
}
