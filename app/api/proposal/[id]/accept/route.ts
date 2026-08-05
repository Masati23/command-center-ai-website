import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const proposal = await db.proposal.findUnique({ where: { id: params.id } });
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.proposal.update({
    where: { id: params.id },
    data: { status: "ACCEPTED" },
  });

  await db.eventLog.create({
    data: { type: "proposal_accepted", refId: proposal.id },
  });

  return NextResponse.json({ status: updated.status });
}
