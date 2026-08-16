import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { VISITOR_COOKIE, classifyBrowser } from "@/lib/tracking";

/**
 * Best-effort checkout attribution, built entirely from data this app
 * already collects for ordinary page-view analytics (VisitorTracker /
 * app/api/track/visit) — no new tracking surface, no new cookie, and no
 * fresh PII. We just join the existing anonymous visitor id (already
 * sitting in a cookie on the buyer's browser) against the Visitor row
 * created on their first page view, and read the current request's
 * user-agent for a coarse browser label.
 *
 * If the visitor cookie is missing (blocked cookies, first-party privacy
 * mode, etc.) or the Visitor row hasn't been written yet, every field is
 * simply null — this must never block or slow down checkout, only enrich
 * it when the data is available.
 */
export interface CheckoutAttribution {
  visitorId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  sourceBucket: string | null;
  landingPage: string | null;
  referrer: string | null;
  device: string | null;
  browser: string;
}

export async function buildCheckoutAttribution(req: NextRequest): Promise<CheckoutAttribution> {
  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value ?? null;
  const browser = classifyBrowser(req.headers.get("user-agent"));

  if (!visitorId) {
    return {
      visitorId: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      sourceBucket: null,
      landingPage: null,
      referrer: null,
      device: null,
      browser,
    };
  }

  try {
    const visitor = await db.visitor.findUnique({
      where: { visitorId },
      select: {
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        sourceBucket: true,
        landingPage: true,
        referrer: true,
        device: true,
      },
    });

    if (!visitor) {
      return {
        visitorId,
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        sourceBucket: null,
        landingPage: null,
        referrer: null,
        device: null,
        browser,
      };
    }

    return {
      visitorId,
      utmSource: visitor.utmSource,
      utmMedium: visitor.utmMedium,
      utmCampaign: visitor.utmCampaign,
      sourceBucket: visitor.sourceBucket,
      landingPage: visitor.landingPage,
      referrer: visitor.referrer,
      device: visitor.device,
      browser,
    };
  } catch (err) {
    // Attribution is strictly best-effort — a lookup failure must never
    // block or delay checkout creation.
    console.error("Checkout attribution lookup failed:", err);
    return {
      visitorId,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      sourceBucket: null,
      landingPage: null,
      referrer: null,
      device: null,
      browser,
    };
  }
}
