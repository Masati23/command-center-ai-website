import React from "react";
import { Section, SectionHeading, Badge, Button } from "./ui";
import ChatbotMockup from "./dashboards/ChatbotMockup";
import BookingMockup from "./dashboards/BookingMockup";
import CrmMockup from "./dashboards/CrmMockup";
import ExecutiveDashboardMockup from "./dashboards/ExecutiveDashboardMockup";

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="mt-0.5 shrink-0 text-electric-400"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Service {
  tag: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  visual: React.ReactNode;
}

const services: Service[] = [
  {
    tag: "Service 01",
    name: "AI Website Chatbot",
    price: "Starting at $449",
    description: "A tireless front-line assistant that greets, answers, and captures every visitor.",
    features: [
      "Answers customer questions 24/7",
      "Captures leads",
      "Handles FAQs",
      "Website integration",
      "Live AI chat",
      "Email notifications",
    ],
    visual: <ChatbotMockup />,
  },
  {
    tag: "Service 02",
    name: "AI Appointment Booking Bot",
    price: "Starting at $549",
    description: "Let customers book themselves in — day or night — with zero back-and-forth.",
    features: [
      "Appointment scheduling",
      "Calendar integration",
      "Customer reminders",
      "Contact capture",
      "Business hours",
    ],
    visual: <BookingMockup />,
  },
  {
    tag: "Service 03",
    name: "AI Lead Generation System",
    price: "Starting at $899",
    description: "Find, qualify, and nurture new business automatically, every single day.",
    features: [
      "Business lead discovery",
      "Contact management",
      "Lead qualification",
      "Pipeline tracking",
      "Follow-up automation",
    ],
    visual: <CrmMockup />,
  },
  {
    tag: "Service 04",
    name: "AI Business Command Center",
    price: "Starting at $1,999",
    description: "One executive dashboard that runs your entire operation on autopilot.",
    features: [
      "Executive dashboard",
      "AI Assistant",
      "Workflow automation",
      "Lead Management",
      "Analytics",
      "Reports",
      "Business insights",
    ],
    visual: <ExecutiveDashboardMockup />,
  },
];

export default function Services() {
  return (
    <Section id="solutions">
      <SectionHeading
        eyebrow="Solutions"
        title="AI systems built to run your business"
        description="Every solution is custom-configured for your company — not a generic bot. Pick one, or combine them into a full command center."
      />

      <div className="mt-20 space-y-24">
        {services.map((service, idx) => (
          <div
            key={service.name}
            className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
              idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <Badge>{service.tag}</Badge>
              <h3 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">
                {service.name}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-silver-400">
                {service.description}
              </p>

              <p className="mt-5 text-2xl font-semibold text-gradient">{service.price}</p>

              <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-silver-300">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button href="#contact" variant="secondary">
                  Free AI Consultation
                </Button>
              </div>
            </div>

            <div>{service.visual}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
