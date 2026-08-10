import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { z } from "zod";
import { db } from "@/lib/db";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { classifySourceBucket, classifyDevice } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_SESSION_COOKIE = "cc_admin_session";

const bodySchema = z.object({
  visitorId: z.string().uuid(),
  path: z.string().min(1).max(500),
  landingPage: z.string().min(1).max(500),
  referrer: z.string().max(1000).nullable().optional(),
  utmSource: z.string().max(200).nullable().optional(),
  utmMedium: z.string().max(200).nullable().optional(),
  utmCampaign: z.string().max(200).nullable().optional(),
  utmContent: z.string().max(200).nullable().optional(),
  utmTerm: z.string().max(200).nullable().optional(),
});

/**
 * Real-visit-to-database analytics. Admin exclusion is server-side and
 * authoritative: it checks the same signed session cookie middleware.ts
 * protects /admin/* with, so it only ever excludes a genuinely logged-in
 * admin session — never ordinary visitors, and never based on path alone
 * (an admin browsing the public site while logged in shouldn't count
 * either, which path-only exclusion would miss).
 */
async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (isRateLimited(getClientIp(req), 240, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Admin traffic must never inflate public analytics — but this check is
  // deliberately narrow (a verified signed cookie), so it can only ever
  // exclude real admin sessions, never accidentally swallow real visitors.
  if (await isAdminRequest(req)) {
    return NextResponse.json({ ok: true, tracked: false });
  }

  const { visitorId, path, landingPage, referrer, utmSource, utmMedium, utmCampaign, utmContent, utmTerm } = parsed.data;

  try {
    const existing = await db.visitor.findUnique({ where: { visitorId }, select: { visitorId: true } });

    if (existing) {
      // Returning visitor / later page view in the same session — only
      // touch lastSeenAt (powers "live"), never overwrite first-touch
      // attribution.
      await db.visitor.update({ where: { visitorId }, data: { lastSeenAt: new Date() } });
    } else {
      const sourceBucket = classifySourceBucket(utmSource ?? null, referrer ?? null);
      const device = classifyDevice(req.headers.get("user-agent"));
      await db.visitor.create({
        data: {
          visitorId,
          landingPage,
          referrer: referrer ?? null,
          utmSource: utmSource ?? null,
          utmMedium: utmMedium ?? null,
          utmCampaign: utmCampaign ?? null,
          utmContent: utmContent ?? null,
          utmTerm: utmTerm ?? null,
          sourceBucket,
          device,
        },
      });
    }

    await db.pageView.create({ data: { visitorId, path } });
  } catch (err) {
    // Best-effort — a tracking failure should never break the page the
    // visitor is actually trying to use.
    console.error("Visit tracking write failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, tracked: true });
}
