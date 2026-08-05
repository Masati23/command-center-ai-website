import React from "react";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-electric-500/15 text-electric-300",
  contacted: "bg-amber-500/15 text-amber-300",
  qualified: "bg-purple-500/15 text-purple-300",
  won: "bg-green-500/15 text-green-300",
  closed: "bg-white/[0.06] text-silver-500",
};

export const STATUS_OPTIONS = ["new", "contacted", "qualified", "won", "closed"] as const;

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status] ?? "bg-white/[0.06] text-silver-400"}`}>
      {status}
    </span>
  );
}
