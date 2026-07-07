import React from "react";

function MiniLineChart() {
  return (
    <svg viewBox="0 0 300 100" className="h-24 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f8bff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2f8bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,70 L30,60 L60,66 L90,45 L120,50 L150,30 L180,38 L210,20 L240,26 L270,10 L300,16"
        fill="none"
        stroke="#5eb3ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0,70 L30,60 L60,66 L90,45 L120,50 L150,30 L180,38 L210,20 L240,26 L270,10 L300,16 L300,100 L0,100 Z"
        fill="url(#heroChartFill)"
        stroke="none"
      />
    </svg>
  );
}

export default function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-lg animate-float">
      {/* ambient glow behind card */}
      <div className="absolute -inset-8 -z-10 rounded-[2rem] bg-electric-500/20 blur-3xl" />

      <div className="glass-strong overflow-hidden rounded-2xl shadow-card">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="text-xs font-medium tracking-wide text-silver-400">
            Command Center — Overview
          </span>
          <span className="flex h-2 w-2 rounded-full bg-electric-400 shadow-glow" />
        </div>

        <div className="space-y-5 p-5">
          {/* top stat row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Leads Captured", value: "1,284", delta: "+18%" },
              { label: "Appointments", value: "312", delta: "+9%" },
              { label: "Avg. Response", value: "8s", delta: "-42%" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/[0.03] p-3.5">
                <p className="text-[10px] uppercase tracking-wide text-silver-500">{s.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{s.value}</p>
                <p className="text-[11px] font-medium text-electric-400">{s.delta}</p>
              </div>
            ))}
          </div>

          {/* chart */}
          <div className="rounded-xl bg-white/[0.03] p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium text-silver-300">Business Growth</p>
              <p className="text-[11px] text-electric-400">Last 30 days</p>
            </div>
            <MiniLineChart />
          </div>

          {/* activity feed */}
          <div className="rounded-xl bg-white/[0.03] p-4">
            <p className="mb-3 text-xs font-medium text-silver-300">AI Activity</p>
            <ul className="space-y-2.5">
              {[
                "Booked appointment with J. Ramirez",
                "Answered 6 chatbot inquiries",
                "Qualified new lead — HVAC Co.",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs text-silver-400">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
