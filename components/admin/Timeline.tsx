import React from "react";
import Link from "next/link";

export interface TimelineEntry {
  timestamp: Date;
  label: string;
  detail?: string;
  href?: string;
}

/** One chronological history — merges whatever sources the caller already queried and sorted. */
export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-silver-500">No activity recorded yet.</p>;
  }

  return (
    <div className="space-y-0">
      {entries.map((e, i) => {
        const content = (
          <div className="flex-1 pb-6">
            <p className="text-sm text-silver-200">{e.label}</p>
            {e.detail && <p className="mt-0.5 text-xs text-silver-500">{e.detail}</p>}
            <p className="mt-1 text-xs text-silver-600">{e.timestamp.toLocaleString("en-US")}</p>
          </div>
        );
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric-400" />
              {i < entries.length - 1 && <span className="w-px flex-1 bg-white/10" />}
            </div>
            {e.href ? (
              <Link href={e.href} className="flex-1 hover:opacity-80">
                {content}
              </Link>
            ) : (
              content
            )}
          </div>
        );
      })}
    </div>
  );
}
