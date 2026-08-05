import { NextRequest, NextResponse } from "next/server";
import { markAbandonedAssessments } from "@/lib/assessment-lifecycle";

export const runtime = "nodejs";

/**
 * Runs once daily via Vercel Cron (see vercel.json) — the Hobby plan caps
 * cron jobs at once per day, so this can't run hourly. ABANDONED_AFTER_HOURS
 * in lib/assessment-lifecycle.ts is 48, so a once-daily sweep still catches
 * every stale draft well within that window; it just doesn't need to run
 * more often than that to do so.
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
