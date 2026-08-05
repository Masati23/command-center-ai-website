import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assessments = await db.assessment.findMany({
    where: { status: "SUBMITTED" },
    include: { customer: true, score: true },
    orderBy: { submittedAt: "desc" },
  });

  const rows = assessments.map((a) => ({
    name: a.customer?.name ?? "",
    business: a.customer?.businessName ?? "",
    email: a.customer?.email ?? "",
    phone: a.customer?.phone ?? "",
    readinessScore: a.score?.overallReadinessScore ?? "",
    complexity: a.score?.complexityTier ?? "",
    submittedAt: a.submittedAt?.toISOString() ?? "",
  }));

  return csvResponse(toCsv(rows), "leads.csv");
}
