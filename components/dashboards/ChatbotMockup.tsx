import React from "react";
import { LogoMark } from "../Logo";

export default function ChatbotMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-electric-500/15 blur-3xl" />

      {/* Browser frame representing "your website" */}
      <div className="glass-strong overflow-hidden rounded-2xl shadow-card">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <div className="ml-3 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-1 text-[11px] text-silver-500">
            yourbusiness.com
          </div>
        </div>

        {/* mock site content */}
        <div className="space-y-2 px-5 pt-5">
          <div className="h-2.5 w-2/3 rounded bg-white/[0.06]" />
          <div className="h-2.5 w-1/2 rounded bg-white/[0.04]" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 px-5">
          <div className="h-14 rounded-lg bg-white/[0.03]" />
          <div className="h-14 rounded-lg bg-white/[0.03]" />
          <div className="h-14 rounded-lg bg-white/[0.03]" />
        </div>

        {/* chat widget */}
        <div className="relative mt-6 px-5 pb-5">
          <div className="ml-auto w-[86%] overflow-hidden rounded-2xl border border-electric-500/25 bg-navy-900/95 shadow-glow">
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-electric-600/40 to-electric-500/10 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <LogoMark className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Command Center AI Assistant</p>
                <p className="flex items-center gap-1 text-[10px] text-electric-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric-400" /> Online now
                </p>
              </div>
            </div>

            <div className="space-y-2.5 px-4 py-4">
              <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-[11.5px] text-silver-200">
                Hi! Do you offer weekend appointments?
              </div>
              <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-electric-600/80 px-3 py-2 text-[11.5px] text-white">
                Yes — we have Saturday slots open this week. Want me to grab your name and best number to book one?
              </div>
              <div className="flex items-center gap-1 pl-1">
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400" />
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400 [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400 [animation-delay:0.3s]" />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 px-3 py-2.5">
              <div className="flex-1 rounded-full bg-white/[0.05] px-3 py-2 text-[11px] text-silver-500">
                Type a message…
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
