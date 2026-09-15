"use client";

import React from "react";
import type { CardClickAction } from "@/lib/connect";
import { VISITOR_COOKIE } from "@/lib/tracking";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

// Fires a best-effort click beacon, then lets the link/button's normal
// behavior proceed untouched (external navigation, mailto:, or a file
// download) -- never calls preventDefault. Same navigator.sendBeacon
// pattern already used for buy-click tracking in components/Services.tsx,
// chosen specifically because it's guaranteed to deliver even though the
// browser is about to navigate away or start a download.
function fireBeacon(action: CardClickAction) {
    const payload = JSON.stringify({ action, visitorId: getCookie(VISITOR_COOKIE) });
    try {
          if (typeof navigator !== "undefined" && navigator.sendBeacon) {
                  const blob = new Blob([payload], { type: "application/json" });
                  const sent = navigator.sendBeacon("/api/connect/click", blob);
                  if (sent) return;
          }
    } catch {
          // fall through to fetch
    }
    fetch("/api/connect/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
    }).catch(() => {});
}

export function TrackedAnchor({
    action,
    href,
    className,
    children,
    download,
    target,
    rel,
}: {
    action: CardClickAction;
    href: string;
    className?: string;
    children: React.ReactNode;
    download?: boolean | string;
    target?: string;
    rel?: string;
}) {
    return (
          <a
                  href={href}
                  className={className}
                  download={download}
                  target={target}
                  rel={rel}
                  onClick={() => fireBeacon(action)}
                >
            {children}
          </a>
        );
}
