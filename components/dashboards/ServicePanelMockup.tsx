"use client";

import React from "react";

/**
 * Shared visual treatment for service cards that don't have a bespoke,
 * fully custom illustrated mockup (the original 4 services each have their
 * own — ChatbotMockup, BookingMockup, CrmMockup, ExecutiveDashboardMockup).
 * Rather than reuse one of those unrelated mockups on a new service (which
 * would misleadingly imply, say, the Reputation Management panel has a
 * booking calendar), this gives every new service a clean, honest,
 * consistent panel: an icon, a label, and its real feature list.
 */
export default function ServicePanelMockup({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/80 shadow-card">
      <div className="flex items-center gap-3 border-b border-white/5 bg-navy-900/60 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-electric-500/15 text-electric-400">
          {icon}
        </div>
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
      <div className="space-y-3 px-5 py-6">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric-400" />
            <span className="text-xs text-silver-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
