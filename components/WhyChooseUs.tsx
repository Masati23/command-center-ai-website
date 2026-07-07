import React from "react";
import { Section, SectionHeading, GlassCard } from "./ui";

const reasons = [
  {
    title: "Fast Deployment",
    description: "Your AI system goes live in days, not months — with clear milestones the whole way.",
    icon: (
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Custom-Built Solutions",
    description: "No generic templates. Every system is configured around how your business actually operates.",
    icon: <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2M8.5 15.5l-2 2m0-11 2 2m7 7 2 2" strokeLinecap="round" />,
  },
  {
    title: "Professional Support",
    description: "A real team behind every deployment, ready to adjust and improve as your needs change.",
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Built for Small Business",
    description: "Enterprise-grade AI, priced and packaged for growing companies — not just Fortune 500s.",
    icon: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Scalable as You Grow",
    description: "Start with one system and expand into a full command center whenever you're ready.",
    icon: <path d="m3 17 6-6 4 4 8-8M21 7v6M21 7h-6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: "Reliable AI Automation",
    description: "Monitored, maintained, and built to keep working quietly in the background every day.",
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export default function WhyChooseUs() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why Choose Us"
        title="Built to earn your trust, not just your business"
        description="We treat every deployment like it's our own company depending on it."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r) => (
          <GlassCard key={r.title} className="p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-500/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2">
                {r.icon}
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-silver-400">{r.description}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
