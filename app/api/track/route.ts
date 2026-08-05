import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Traffic-level analytics (visitors, page views, device, referral, geo) are
// handled by Vercel Web Analytics — no PII, no cookies, enabled separately
// in the Vercel dashboard. This endpoint covers only what Vercel can't see:
// business-specific interactions tied to a product, stored in the existing
// EventLog table and read back by the Service Interest and Overview admin
// pages. No visitor identity is captured here, intentionally.
const VALID_TYPES = ["buy_click", "consult_click"] as const;

const bodySchema = z.object({
  type: z.enum(VALID_TYPES),
  productSlug: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIp(req), 60, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await db.eventLog.create({
      data: { type: parsed.data.type, refId: parsed.data.productSlug, metadata: { productSlug: parsed.data.productSlug } },
    });
  } catch (err) {
    // Best-effort — a tracking failure should never break the button the
    // visitor actually clicked.
    console.error("Event tracking write failed:", err);
  }

  return NextResponse.json({ ok: true });
}
