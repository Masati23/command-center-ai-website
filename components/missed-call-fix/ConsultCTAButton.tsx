"use client";

import { Button } from "@/components/ui";

/**
 * Same fire-and-forget tracking pattern as the "consult_click" events on
 * the homepage Services.tsx buttons (POST /api/track, existing EventLog
 * table, existing Service Interest / Recent Activity admin views) — reused
 * here rather than building a second tracking path. productSlug carries the
 * industry variant (e.g. "missed-call-fix:auto-repair") so it's visible in
 * the raw event data even though this isn't a real Product row.
 */
export default function ConsultCTAButton({
  productSlug,
  variant = "primary",
  className = "",
  children,
}: {
  productSlug: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
}) {
  function handleClick() {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "consult_click", productSlug }),
    }).catch(() => {
      // Best-effort — never block navigation on a tracking failure.
    });
  }

  return (
    <Button href="/#contact" variant={variant} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}
