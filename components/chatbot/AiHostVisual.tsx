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
export default function AiHostVisual({ compact = false, mini = false }: { compact?: boolean; mini?: boolean }) {
  // Mini: a slim horizontal bar (small avatar + status pill side by side)
  // used once the panel switches into compact "conversation mode" so the
  // welcome block no longer eats into the message-history space. Same
  // image, same status pill styling — just laid out to take far less
  // vertical room, not a visual redesign.
  if (mini) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-navy-800 ring-2 ring-electric-500/30 shadow-glow">
          <Image
            src="/chatbot/assistant-host.png"
            alt="Command Center AI Assistant"
            fill
            sizes="32px"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10.5px] font-medium text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          AI Assistant Online
        </span>
      </div>
    );
  }

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
