import React from "react";
import { Section, SectionHeading, GlassCard, Button } from "./ui";

interface Package {
  name: string;
  tag?: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const packages: Package[] = [
  {
    name: "Starter Package",
    tag: "AI Website Chatbot",
    price: "Starting at $449",
    description: "Perfect for businesses wanting an AI assistant on their website.",
    features: [
      "24/7 AI website chatbot",
      "Lead capture built in",
      "FAQ automation",
      "Email notifications",
    ],
  },
  {
    name: "Growth Package",
    tag: "Lead Generation & Follow-Ups",
    price: "Starting at $899",
    description: "Perfect for businesses wanting more qualified leads.",
    features: [
      "Everything in Starter",
      "AI lead generation system",
      "Automated follow-up sequences",
      "Pipeline tracking",
    ],
    highlighted: true,
  },
  {
    name: "Business Package",
    tag: "Complete AI Command Center",
    price: "Starting at $1,999",
    description: "Perfect for businesses ready to automate multiple business processes.",
    features: [
      "Everything in Growth",
      "Executive dashboard & AI Assistant",
      "Full workflow automation",
      "Analytics, reports & insights",
    ],
  },
];

const supportTiers = [
  {
    name: "Basic",
    price: "$59",
    features: ["System monitoring", "Monthly health check", "Minor content updates", "Email support"],
  },
  {
    name: "Growth",
    price: "$129",
    features: ["Everything in Basic", "Priority response times", "Monthly performance report", "Workflow adjustments"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$249",
    features: ["Everything in Growth", "Dedicated support line", "Ongoing optimization", "Quarterly strategy review"],
  },
];

export default function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple packages. Real results."
        description="Choose the package that matches where your business is today. Every system is built once and yours to keep."
      />

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {packages.map((pkg) => (
          <GlassCard
            key={pkg.name}
            className={`flex flex-col p-8 ${
              pkg.highlighted ? "border-electric-500/40 shadow-glow md:-translate-y-3" : ""
            }`}
          >
            {pkg.highlighted && (
              <span className="mb-4 w-fit rounded-full bg-electric-500/15 px-3 py-1 text-xs font-medium text-electric-400">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-semibold text-white">{pkg.name}</h3>
            {pkg.tag && <p className="mt-1 text-sm text-electric-400">{pkg.tag}</p>}
            <p className="mt-5 text-3xl font-semibold text-white">{pkg.price}</p>
            <p className="mt-3 text-sm leading-relaxed text-silver-400">{pkg.description}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-silver-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0 text-electric-400">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Button
              href="#contact"
              variant={pkg.highlighted ? "primary" : "secondary"}
              className="mt-8 w-full"
            >
              Free AI Consultation
            </Button>
          </GlassCard>
        ))}
      </div>

      {/* Monthly support tiers */}
      <div className="mt-28">
        <SectionHeading
          eyebrow="Ongoing Support"
          title="Monthly Support Plans"
          description="Keep your AI systems running smoothly, updated, and optimized long after launch."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {supportTiers.map((tier) => (
            <GlassCard
              key={tier.name}
              className={`flex flex-col p-8 ${
                tier.highlighted ? "border-electric-500/40 shadow-glow md:-translate-y-3" : ""
              }`}
            >
              <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
              <p className="mt-4 text-3xl font-semibold text-white">
                {tier.price}
                <span className="text-base font-normal text-silver-500">/month</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-silver-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0 text-electric-400">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                href="#contact"
                variant={tier.highlighted ? "primary" : "secondary"}
                className="mt-8 w-full"
              >
                Choose {tier.name}
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
