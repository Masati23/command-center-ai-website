import React from "react";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const dates = [26, 27, 28, 29, 30, 1, 2];

export default function BookingMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-electric-500/15 blur-3xl" />

      <div className="glass-strong overflow-hidden rounded-2xl shadow-card">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <span className="text-xs font-medium tracking-wide text-silver-400">
            Appointment Booking — This Week
          </span>
          <span className="rounded-full bg-electric-500/15 px-2.5 py-1 text-[10px] font-medium text-electric-400">
            Auto-sync
          </span>
        </div>

        <div className="p-5">
          {/* mini calendar strip */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {days.map((d, i) => (
              <div key={`${d}-${i}`} className="text-[10px] text-silver-500">
                {d}
              </div>
            ))}
            {dates.map((d, i) => (
              <div
                key={d}
                className={`rounded-lg py-2 text-xs font-medium ${
                  i === 3
                    ? "bg-electric-500 text-white shadow-glow"
                    : "bg-white/[0.03] text-silver-300"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* time slots */}
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-medium text-silver-400">
              Wednesday, Available Slots
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"].map(
                (t, i) => (
                  <div
                    key={t}
                    className={`rounded-lg border px-2 py-2 text-center text-[11px] ${
                      i === 1
                        ? "border-electric-500/50 bg-electric-500/10 text-electric-300"
                        : "border-white/5 bg-white/[0.02] text-silver-400"
                    }`}
                  >
                    {t}
                  </div>
                )
              )}
            </div>
          </div>

          {/* upcoming appointments */}
          <div className="mt-5 space-y-2.5">
            <p className="text-[11px] font-medium text-silver-400">Upcoming</p>
            {[
              { name: "Maria Gonzalez", time: "Wed · 10:30 AM", tag: "Confirmed" },
              { name: "David Chen", time: "Thu · 2:00 PM", tag: "Reminder sent" },
              { name: "Sarah Patel", time: "Fri · 9:00 AM", tag: "New" },
            ].map((appt) => (
              <div
                key={appt.name}
                className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-500/20 text-[11px] font-semibold text-electric-300">
                    {appt.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{appt.name}</p>
                    <p className="text-[10.5px] text-silver-500">{appt.time}</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[9.5px] font-medium text-silver-400">
                  {appt.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
