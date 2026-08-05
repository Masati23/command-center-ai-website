"use client";

import React, { useState } from "react";

/** Small "?" hover/tap target explaining exactly how a metric is calculated. */
export default function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        aria-label="How this is calculated"
        className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-silver-400 hover:bg-white/20 hover:text-white"
      >
        ?
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-navy-900 p-3 text-left text-[11px] font-normal leading-relaxed text-silver-300 shadow-card">
          {text}
        </span>
      )}
    </span>
  );
}
