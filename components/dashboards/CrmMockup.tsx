import React from "react";

const columns = [
  {
    title: "New Leads",
    count: 24,
    cards: [
      { name: "Apex Roofing", detail: "Website form" },
      { name: "Bright Dental", detail: "Google Ads" },
    ],
  },
  {
    title: "Contacted",
    count: 12,
    cards: [{ name: "Lonestar HVAC", detail: "Follow-up sent" }],
  },
  {
    title: "Qualified",
    count: 8,
    cards: [{ name: "Gulf Coast Legal", detail: "Score 92" }],
  },
  {
    title: "Won",
    count: 5,
    cards: [{ name: "Prime Auto Group", detail: "Closed $4,200" }],
  },
];

export default function CrmMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-electric-500/15 blur-3xl" />

      <div className="glass-strong overflow-hidden rounded-2xl shadow-card">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <span className="text-xs font-medium tracking-wide text-silver-400">
            Lead Pipeline — This Month
          </span>
          <span className="rounded-full bg-electric-500/15 px-2.5 py-1 text-[10px] font-medium text-electric-400">
            49 active leads
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="rounded-xl bg-white/[0.03] p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[10.5px] font-semibold text-silver-300">{col.title}</p>
                <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9.5px] text-silver-500">
                  {col.count}
                </span>
              </div>
              <div className="space-y-2">
                {col.cards.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-lg border border-white/5 bg-navy-900/60 p-2.5 shadow-sm"
                  >
                    <p className="text-[10.5px] font-medium text-white">{c.name}</p>
                    <p className="mt-0.5 text-[9.5px] text-electric-400">{c.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* qualification + follow-up strip */}
        <div className="mx-4 mb-4 rounded-xl bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-silver-300">Lonestar HVAC</p>
            <span className="rounded-full bg-electric-500/15 px-2 py-0.5 text-[9.5px] font-medium text-electric-300">
              Lead Score 84
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-electric-500 to-electric-400" />
          </div>
          <p className="mt-2.5 text-[10.5px] text-silver-500">
            Next automated follow-up scheduled in 2 hours
          </p>
        </div>
      </div>
    </div>
  );
}
