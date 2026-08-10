"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { VISITOR_COOKIE } from "@/lib/tracking";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function getOrCreateVisitorId(): string {
  const existing = getCookie(VISITOR_COOKIE);
  if (existing) return existing;
  const id = crypto.randomUUID();
  setCookie(VISITOR_COOKIE, id, 60 * 60 * 24 * 365); // 1 year — this is what makes a visitor "persistent," not a per-tab/session value
  return id;
}

const LANDING_PAGE_KEY = "cc_landing_page";

/**
 * Mounted once in the root layout. Fires a beacon to /api/track/visit on
 * first mount and on every client-side route change. Deliberately reads
 * window.location directly (not useSearchParams) so this never forces the
 * marketing pages that use it out of static rendering.
 *
 * Admin exclusion happens server-side in the API route, not here — but
 * this also skips /admin/* paths outright as a second, redundant layer
 * (an admin session should never even attempt to write a page view for
 * its own dashboard pages).
 */
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const visitorId = getOrCreateVisitorId();
    const url = new URL(window.location.href);

    // First-touch landing page for this browser session — sessionStorage
    // (not cookie) is intentional: it should reset per tab/session, not
    // persist for a year like the visitor id itself.
    let landingPage = sessionStorage.getItem(LANDING_PAGE_KEY);
    if (!landingPage) {
      landingPage = pathname + url.search;
      sessionStorage.setItem(LANDING_PAGE_KEY, landingPage);
    }

    const payload = {
      visitorId,
      path: pathname + url.search,
      landingPage,
      referrer: document.referrer || null,
      utmSource: url.searchParams.get("utm_source"),
      utmMedium: url.searchParams.get("utm_medium"),
      utmCampaign: url.searchParams.get("utm_campaign"),
      utmContent: url.searchParams.get("utm_content"),
      utmTerm: url.searchParams.get("utm_term"),
    };

    fetch("/api/track/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Best-effort — never surface a tracking failure to the visitor.
    });
  }, [pathname]);

  return null;
}
