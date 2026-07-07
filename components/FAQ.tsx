"use client";

import React, { useState } from "react";
import { Section, SectionHeading } from "./ui";

const faqs = [
  {
    q: "How long does setup take?",
    a: "Most AI systems are configured and live within 5–10 business days, depending on the complexity of the solution and how quickly we can gather your business details (hours, services, integrations, etc.).",
  },
  {
    q: "Can you customize the system?",
    a: "Yes. Every system is configured around your business — your services, your tone of voice, your booking rules, and your existing tools. Nothing is a generic, one-size-fits-all bot.",
  },
  {
    q: "Do you provide support?",
    a: "Yes. Every project includes an onboarding period, and ongoing monthly support plans are available to keep your system monitored, updated, and optimized long-term.",
  },
  {
    q: "Do I own my system?",
    a: "Yes. Once built, the AI system is yours. Monthly support plans are optional and cover monitoring, updates, and optimization — they are not required for you to keep using what we build.",
  },
  {
    q: "Can it integrate with my existing software?",
    a: "In most cases, yes. We regularly integrate with calendars, CRMs, websites, and messaging tools. Let us know what you're currently using and we'll confirm compatibility before we start.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section>
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />

      <div className="mx-auto mt-14 max-w-3xl space-y-4">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="glass overflow-hidden rounded-2xl">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium text-white">{item.q}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`shrink-0 text-electric-400 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-silver-400">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
