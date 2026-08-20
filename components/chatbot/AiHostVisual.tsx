import React from "react";

/**
 * The assistant panel's visual "host" area. Today this is a static,
 * original illustration (no photo, no third-party avatar service, no paid
 * API) plus an "AI Assistant Online" status pill. It is intentionally
 * isolated in its own component with a single swap point (`AvatarMedia`
 * below) so that a future live/talking avatar (e.g. a video element or an
 * embedded avatar-vendor <iframe>/SDK widget) can replace just that piece
 * without touching AssistantPanel's layout, copy, or state at all — same
 * props in, same space filled.
 */
function AvatarMedia() {
  // Original vector illustration — not a photo of a real person, and not
  // sourced from any paid avatar/likeness service. Soft, professional,
  // on-brand (electric blue) silhouette bust with a subtle headset detail
  // to read clearly as "AI assistant," swappable later for e.g. a <video>
  // element with the exact same aspect ratio.
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="Command Center AI Assistant">
      <defs>
        <linearGradient id="hostBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f8bff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#5eb3ff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="hostFigure" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eb3ff" />
          <stop offset="100%" stopColor="#1a6ef0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#hostBg)" />
      {/* shoulders/bust */}
      <path d="M40 178c6-34 28-52 60-52s54 18 60 52" fill="url(#hostFigure)" opacity="0.9" />
      {/* head */}
      <circle cx="100" cy="92" r="34" fill="url(#hostFigure)" />
      {/* hair silhouette */}
      <path
        d="M68 88c-2-22 12-40 32-40s34 18 32 40c0 4-1 8-2 11-4-14-16-22-30-22s-26 8-30 22c-1-3-2-7-2-11Z"
        fill="#0f52c9"
        opacity="0.85"
      />
      {/* headset arc, to read clearly as an AI/support assistant */}
      <path
        d="M70 86a30 30 0 0 1 60 0"
        fill="none"
        stroke="#e7ebf1"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="70" cy="90" r="5" fill="#e7ebf1" />
      <circle cx="130" cy="90" r="5" fill="#e7ebf1" />
    </svg>
  );
}

export default function AiHostVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative overflow-hidden rounded-full border border-electric-500/20 bg-gradient-to-b from-electric-50 to-white shadow-inner ${
          compact ? "h-20 w-20" : "h-36 w-36 sm:h-44 sm:w-44"
        }`}
      >
        <AvatarMedia />
      </div>
      <div
        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ${
          compact ? "mt-2" : ""
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        AI Assistant Online
      </div>
    </div>
  );
}
