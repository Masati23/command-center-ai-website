import React from "react";

/**
 * Command Center AI logomark.
 *
 * This is a hand-built vector reproduction of the official logo (four-point
 * chrome compass star, dashed blue quadrant rings, glowing blue core, chrome
 * wordmark) — built directly from the reference artwork because this
 * environment could not ingest the source file itself (upload, Drive, and
 * Imgur links were all unreachable from this session). Vector/CSS can
 * closely approximate the shapes and colors but not the photoreal chrome
 * bevel and lens-flare rendering of the original raster file.
 *
 * To swap in the real file once it can be transferred: drop it in
 * `public/` (e.g. `public/logo.png`) and replace the <svg> markup below
 * with a `next/image` tag pointing at it. Every place in the site imports
 * LogoMark/LogoFull from here, so a single edit updates the whole site.
 */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

// Four quadrant arcs (blue) with gaps left at the cardinal points for the
// star's blade tips to pass through — matches the reference artwork.
const ARC_R = 92;
const arcs = [10, 100, 190, 280].map((start) => describeArc(100, 100, ARC_R, start, start + 70));

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ccaiChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#c9d1dd" />
          <stop offset="55%" stopColor="#6b7789" />
          <stop offset="80%" stopColor="#e7ebf1" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="ccaiChromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f2f5f9" />
          <stop offset="40%" stopColor="#8b96a6" />
          <stop offset="60%" stopColor="#c9d1dd" />
          <stop offset="100%" stopColor="#f7f9fb" />
        </linearGradient>
        <radialGradient id="ccaiGlow" cx="50%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#bfe2ff" />
          <stop offset="70%" stopColor="#2f8bff" />
          <stop offset="100%" stopColor="#0f52c9" />
        </radialGradient>
        <radialGradient id="ccaiWell" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a1a33" />
          <stop offset="100%" stopColor="#050914" />
        </radialGradient>
      </defs>

      {/* dashed blue quadrant arcs */}
      {arcs.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#3b8bff" strokeWidth="6" strokeLinecap="round" />
      ))}

      {/* recessed dark well behind the ring */}
      <circle cx="100" cy="100" r="58" fill="url(#ccaiWell)" />

      {/* chrome ring */}
      <circle cx="100" cy="100" r="58" fill="none" stroke="url(#ccaiChromeRing)" strokeWidth="9" />

      {/* horizontal swept wings */}
      <path
        d="M8 100 C 30 94, 55 96, 78 100 C 55 104, 30 106, 8 100 Z"
        fill="url(#ccaiChrome)"
      />
      <path
        d="M192 100 C 170 94, 145 96, 122 100 C 145 104, 170 106, 192 100 Z"
        fill="url(#ccaiChrome)"
      />

      {/* vertical blade */}
      <path
        d="M100 4 C 108 40, 108 80, 100 100 C 92 80, 92 40, 100 4 Z"
        fill="url(#ccaiChrome)"
      />
      <path
        d="M100 196 C 108 160, 108 120, 100 100 C 92 120, 92 160, 100 196 Z"
        fill="url(#ccaiChrome)"
      />

      {/* thin inner dashed ring for depth */}
      <circle
        cx="100"
        cy="100"
        r="40"
        fill="none"
        stroke="#5eb3ff"
        strokeWidth="2"
        strokeDasharray="10 8"
        opacity="0.6"
      />

      {/* glowing core */}
      <circle cx="100" cy="100" r="17" fill="url(#ccaiGlow)" />
      <circle cx="100" cy="100" r="17" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1" />

      {/* lens-flare sparkle */}
      <g opacity="0.9">
        <path d="M100 84 L103 97 L116 100 L103 103 L100 116 L97 103 L84 100 L97 97 Z" fill="#ffffff" />
      </g>
    </svg>
  );
}

export function LogoFull({
  className = "",
  markClassName = "h-10 w-10",
  showTagline = false,
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={markClassName} />
      <div className="leading-tight">
        <div className="font-semibold tracking-wide text-white">
          <span className="text-[1.05em]">COMMAND</span>
        </div>
        <div className="-mt-0.5 text-sm font-medium tracking-[0.2em] text-electric-400">
          CENTER AI
        </div>
        {showTagline && (
          <div className="mt-1 text-[10px] font-medium tracking-[0.15em] text-silver-400">
            OPERATE SMARTER. SCALE FASTER.
          </div>
        )}
      </div>
    </div>
  );
}
