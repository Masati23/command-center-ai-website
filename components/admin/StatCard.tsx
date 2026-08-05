import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui";
import InfoTooltip from "./InfoTooltip";

/**
 * Every applicable dashboard number is a real link, not a static number —
 * clicking it opens the section that number came from. Cards with no
 * sensible drill-down target (e.g. a plain percentage) omit `href` and
 * render as a plain (non-clickable) card instead of faking a link.
 */
export default function StatCard({
  label,
  value,
  href,
  tooltip,
}: {
  label: string;
  value: React.ReactNode;
  href?: string;
  tooltip?: string;
}) {
  const content = (
    <GlassCard className={`p-5 ${href ? "cursor-pointer transition-colors hover:border-electric-500/40" : ""}`}>
      <div className="flex items-center gap-1.5">
        <p className="text-xs uppercase tracking-wide text-silver-500">{label}</p>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </GlassCard>
  );

  if (!href) return content;
  return (
    <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-400/60 rounded-2xl">
      {content}
    </Link>
  );
}
