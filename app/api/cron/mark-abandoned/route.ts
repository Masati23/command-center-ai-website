import { NextRequest, NextResponse } from "next/server";
import { markAbandonedAssessments } from "@/lib/assessment-lifecycle";

export const runtime = "nodejs";

/**
 * Intended to run on a Vercel Cron schedule (e.g. hourly). Add to
 * vercel.json:
 *   { "crons": [{ "path": "/api/cron/mark-abandoned", "schedule": "0 * * * *" }] }
 * Vercel automatically authenticates its own cron requests; the CRON_SECRET
 * check below additionally protects this endpoint from being triggered by
 * anyone else if it's ever called manually.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const count = await markAbandonedAssessments();
  return NextResponse.json({ marked: count });
}
