import React from "react";
import { Section, Badge, GlassCard } from "./ui";

const stats = [
  { value: "24/7", label: "AI Coverage" },
  { value: "4", label: "Core AI Systems" },
  { value: "100%", label: "Custom Configured" },
];

export default function About() {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <Badge>About Command Center AI</Badge>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Practical AI, built for real businesses
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-silver-400">
            Command Center AI builds practical AI solutions that help businesses automate
            customer communication, lead generation, appointment booking, follow-up,
            reporting, and daily operations.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-silver-400">
            We focus on delivering real business value through professional AI systems
            that save time, improve customer experience, and help companies grow.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-silver-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="p-8 sm:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-electric-500/15 text-lg font-semibold text-electric-400">
              AA
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Alfred Joe Acosta</p>
              <p className="text-sm text-electric-400">Founder &amp; Chief AI Systems Architect</p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-silver-400">
            "Every system we build has to earn its place in your business. That means it
            has to work quietly, reliably, and make an obvious difference — not just look
            impressive in a demo."
          </p>
          <div className="mt-6 border-t border-white/5 pt-6 text-sm text-silver-400">
            <p>Houston, Texas</p>
            <a href="mailto:alfred@commandcenterai.net" className="text-electric-400 hover:underline">
              alfred@commandcenterai.net
            </a>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
