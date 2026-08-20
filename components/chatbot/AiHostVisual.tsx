import React from "react";
import Image from "next/image";

/**
 * The assistant panel's visual "host" area: the official Command Center AI
 * assistant image (a blue/silver robot host, matching the site's branded
 * color scheme) plus an "AI Assistant Online" status pill. The image is
 * fixed brand asset — not generated or altered — cropped to a tight
 * head-and-shoulders frame via `object-cover` so it reads cleanly inside
 * the circular frame at any panel size, without stretching or distortion.
 */
export default function AiHostVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative overflow-hidden rounded-full bg-navy-800 ring-2 ring-electric-500/30 shadow-glow ${
          compact ? "h-16 w-16" : "h-24 w-24 sm:h-28 sm:w-28"
        }`}
      >
        <Image
          src="/chatbot/assistant-host.png"
          alt="Command Center AI Assistant"
          fill
          sizes="(max-width: 640px) 64px, 112px"
          className="object-cover object-[50%_30%]"
          priority
        />
      </div>
      <div
        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300 ${
          compact ? "mt-2" : ""
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        AI Assistant Online
      </div>
    </div>
  );
}
