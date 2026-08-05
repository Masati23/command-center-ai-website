import React from "react";
import { Section, SectionHeading, GlassCard, Button } from "./ui";
import AcademyCallout from "./AcademyCallout";

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
    price: "Starting at $599",
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
    price: "Starting at $1,499",
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
    price: "Starting at $2,099",
    description: "Perfect for businesses ready to automate multiple business processes.",
    features: [
      "Everything in Growth",
      "Executive dashboard & AI Assistant",
      "Full workflow automation",
      "Analytics, reports & insights",
    ],
  },
];

interface SupportTier {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const supportTiers: SupportTier[] = [
  {
    name: "Basic",
    price: "Starting at $99/month",
    features: ["System monitoring", "Monthly health check", "Minor content updates", "Email support"],
  },
  {
    name: "Growth",
    price: "Starting at $149/month",
    features: ["Everything in Basic", "Priority response times", "Monthly performance report", "Workflow adjustments"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "Starting at $249/month",
    features: ["Everything in Growth", "Dedicated support line", "Ongoing optimization", "Quarterly strategy review"],
  },
];

const supportIncludes = [
  {
    title: "Secure Hosting",
    description: "Your AI system runs on monitored, secure infrastructure — no separate hosting to manage.",
  },
  {
    title: "AI Model Updates",
    description: "Ongoing updates as the underlying AI models improve, so your system keeps getting sharper.",
  },
  {
    title: "Knowledge Base Updates",
    description: "We keep your system's answers, services, and business details current as things change.",
  },
  {
    title: "Performance Monitoring",
    description: "Continuous monitoring to catch slowdowns or issues before they affect your customers.",
  },
  {
    title: "Bug Fixes & Maintenance",
    description: "Any issues that come up are diagnosed and resolved as part of your plan.",
  },
  {
    title: "Usage Analytics",
    description: "Visibility into how your AI system is performing and being used, month over month.",
  },
  {
    title: "Email Support",
    description: "Direct email access to our team whenever you have a question or request.",
  },
  {
    title: "Priority Support",
    description: "Faster response times and hands-on assistance on higher support tiers.",
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

      {/* Monthly Support Plans */}
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
              <p className="mt-4 text-3xl font-semibold text-white">{tier.price}</p>

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

      {/* What's included in Monthly Support & Hosting */}
      <div className="mt-28">
        <SectionHeading
          eyebrow="What's Included"
          title="What's Included in Monthly Support & Hosting"
          description="Every support plan keeps your AI system secure, current, and performing."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supportIncludes.map((item) => (
            <GlassCard key={item.title} className="p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric-500/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">{item.title}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-silver-400">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <AcademyCallout />
      </div>
    </Section>
  );
}
