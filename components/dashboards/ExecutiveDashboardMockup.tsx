import React from "react";
import { LogoMark } from "../Logo";

function Bars() {
  const values = [40, 65, 50, 80, 60, 95, 70];
  return (
    <div className="flex h-24 items-end gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-electric-700 to-electric-400" style={{ height: `${v}%` }} />
      ))}
    </div>
  );
}

export default function ExecutiveDashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-electric-500/15 blur-3xl" />

      <div className="glass-strong overflow-hidden rounded-2xl shadow-card">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-5 w-5" />
            <span className="text-xs font-medium tracking-wide text-silver-300">
              Business Command Center
            </span>
          </div>
          <span className="rounded-full bg-electric-500/15 px-2.5 py-1 text-[10px] font-medium text-electric-400">
            Live
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          {/* left: KPIs + chart */}
          <div className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Revenue Influenced", value: "$182K" },
                { label: "Automations Run", value: "3,940" },
                { label: "Hours Saved", value: "612" },
              ].map((k) => (
                <div key={k.label} className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[9.5px] uppercase tracking-wide text-silver-500">{k.label}</p>
                  <p className="mt-1 text-base font-semibold text-white">{k.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-silver-300">Weekly Performance</p>
                <p className="text-[10.5px] text-electric-400">+24% vs last week</p>
              </div>
              <Bars />
            </div>

            <div className="rounded-xl bg-white/[0.03] p-4">
              <p className="mb-2.5 text-xs font-medium text-silver-300">Active Workflows</p>
              <ul className="space-y-2">
                {[
                  { name: "New lead → CRM → Follow-up SMS", status: "Running" },
                  { name: "Missed call → Auto text-back", status: "Running" },
                  { name: "Weekly report → Email summary", status: "Scheduled" },
                ].map((w) => (
                  <li key={w.name} className="flex items-center justify-between text-[11px]">
                    <span className="text-silver-400">{w.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium ${
                        w.status === "Running"
                          ? "bg-electric-500/15 text-electric-300"
                          : "bg-white/[0.06] text-silver-400"
                      }`}
                    >
                      {w.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* right: AI assistant panel */}
          <div className="rounded-xl bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-electric-500/20">
                <LogoMark className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-medium text-silver-300">AI Assistant</p>
            </div>
            <div className="space-y-2.5">
              <div className="rounded-lg rounded-tl-sm bg-white/[0.05] px-3 py-2 text-[10.5px] text-silver-300">
                Give me this week's summary.
              </div>
              <div className="rounded-lg rounded-tl-sm bg-electric-600/70 px-3 py-2 text-[10.5px] text-white">
                312 appointments booked, 49 new leads, response time down 42%. Want the full PDF report?
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
              <p className="text-[9.5px] uppercase tracking-wide text-silver-500">Quick Reports</p>
              {["Sales Summary", "Lead Sources", "Automation ROI"].map((r) => (
                <div key={r} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-2 text-[10.5px] text-silver-400">
                  {r}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
