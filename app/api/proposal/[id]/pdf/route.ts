import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { db } from "@/lib/db";
import { ProposalDocument } from "@/lib/pdf/ProposalDocument";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const proposal = await db.proposal.findUnique({
    where: { id: params.id },
    include: { customer: true, assessment: { include: { score: true } } },
  });

  if (!proposal || !proposal.customer || !proposal.assessment.score) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    React.createElement(ProposalDocument, {
      proposalId: proposal.id,
      customerName: proposal.customer.name,
      businessName: proposal.customer.businessName ?? undefined,
      createdAt: proposal.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      path: proposal.path as "standard" | "deposit" | "consultation",
      recommendedProducts: proposal.recommendedProductsSnapshot as any,
      pricing: proposal.pricingSnapshot as any,
      overallReadinessScore: proposal.assessment.score.overallReadinessScore,
    })
  );

  await db.eventLog.create({
    data: { type: "proposal_pdf_downloaded", refId: proposal.id },
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="command-center-ai-proposal-${proposal.id}.pdf"`,
    },
  });
}
