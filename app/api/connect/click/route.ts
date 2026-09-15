import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isCardClickAction } from "@/lib/connect";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Records one click on the /connect digital business card (Save Contact,
// Email, LinkedIn, Command Center AI, Academy) for the admin "Digital
// Card" analytics panel. Writes to the standalone CardClick table only,
// never touches Visitor/PageView/EventLog or any other existing model, so
// this cannot affect any existing analytics or dashboard.
//
// Sent via navigator.sendBeacon from the client (see
// components/connect/TrackedLink.tsx), the same reliable-before-navigation
// pattern already used for buy-click tracking in components/Services.tsx.
// Always responds 204 even on a bad payload -- a tracking beacon should
// never surface an error to the visitor or block their click.
export async function POST(req: NextRequest) {
  try {
    const rateLimitKey = getClientIp(req);
    if (isRateLimited(rateLimitKey, 30, 60 * 1000)) {
      return new NextResponse(null, { status: 204 });
    }

  const body = await req.json().catch(() => null);
    const action = body?.action;

  if (isCardClickAction(action)) {
    const visitorId = typeof body?.visitorId === "string" ? body.visitorId.slice(0, 100) : null;
    await db.cardClick.create({ data: { action, visitorId } }).catch((err) => {
      console.error("Failed to persist card click:", err);
    });
  }
  } catch (err) {
    console.error("Card click tracking error:", err);
  }

return new NextResponse(null, { status: 204 });
}
