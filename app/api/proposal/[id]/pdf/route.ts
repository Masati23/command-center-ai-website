import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { db } from "@/lib/db";
import { ProposalDocument } from "@/lib/pdf/ProposalDocument";

export const runtime = "nodejs";
// Same confirmed cause as the cron route: this file's GET handler queries
// the database with no dynamic-rendering trigger present, so Next.js would
// try to statically evaluate it at build time.
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const proposal = await db.proposal.findUnique({
    where: { id: params.id },
    include: { customer: true, assessment: { include: { score: true } } },
  });

  if (!proposal || !proposal.customer || !proposal.assessment.score) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  // `as any` bridges a compile-time-only type mismatch: renderToBuffer's
  // TypeScript signature expects its own <Document> element type, but this
  // is a plain .ts file (no JSX), so ProposalDocument must be instantiated
  // via React.createElement — which is typed to the wrapper component's own
  // props, not @react-pdf/renderer's DocumentProps. The element it produces
  // at runtime is identical either way; this doesn't change PDF output.
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
    }) as any
  );

  await db.eventLog.create({
    data: { type: "proposal_pdf_downloaded", refId: proposal.id },
  });

  // NextResponse's body type wants an exact ArrayBuffer, not Node's Buffer
  // (which is a view over a possibly-larger, possibly-pooled ArrayBuffer).
  // Slicing to the buffer's own byteOffset/byteLength gives back precisely
  // the bytes this buffer represents, nothing more.
  const pdfBody = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

  return new NextResponse(pdfBody, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="command-center-ai-proposal-${proposal.id}.pdf"`,
    },
  });
}
