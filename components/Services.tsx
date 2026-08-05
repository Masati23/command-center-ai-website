"use client";

import React from "react";
import { Section, SectionHeading, Badge, Button } from "./ui";
import AcademyCallout from "./AcademyCallout";
import ChatbotMockup from "./dashboards/ChatbotMockup";
import BookingMockup from "./dashboards/BookingMockup";
import CrmMockup from "./dashboards/CrmMockup";
import ExecutiveDashboardMockup from "./dashboards/ExecutiveDashboardMockup";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

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
  nameKey: TranslationKey;
  price: string;
  descriptionKey: TranslationKey;
  featureKeys: TranslationKey[];
  visual: React.ReactNode;
}

const services: Service[] = [
  {
    tag: "Service 01",
    nameKey: "services.chatbot.name",
    price: "Starting at $599",
    descriptionKey: "services.chatbot.description",
    featureKeys: [
      "feature.answers24_7",
      "feature.capturesLeads",
      "feature.handlesFaqs",
      "feature.websiteIntegration",
      "feature.liveAiChat",
      "feature.emailNotifications",
    ],
    visual: <ChatbotMockup />,
  },
  {
    tag: "Service 02",
    nameKey: "services.booking.name",
    price: "Starting at $899",
    descriptionKey: "services.booking.description",
    featureKeys: [
      "feature.appointmentScheduling",
      "feature.calendarIntegration",
      "feature.customerReminders",
      "feature.contactCapture",
      "feature.businessHours",
    ],
    visual: <BookingMockup />,
  },
  {
    tag: "Service 03",
    nameKey: "services.leadgen.name",
    price: "Starting at $1,499",
    descriptionKey: "services.leadgen.description",
    featureKeys: [
      "feature.leadDiscovery",
      "feature.contactManagement",
      "feature.leadQualification",
      "feature.pipelineTracking",
      "feature.followUpAutomation",
    ],
    visual: <CrmMockup />,
  },
  {
    tag: "Service 04",
    nameKey: "services.commandcenter.name",
    price: "Starting at $2,099",
    descriptionKey: "services.commandcenter.description",
    featureKeys: [
      "feature.executiveDashboard",
      "feature.aiAssistant",
      "feature.workflowAutomation",
      "feature.leadManagement",
      "feature.analytics",
      "feature.reports",
      "feature.businessInsights",
    ],
    visual: <ExecutiveDashboardMockup />,
  },
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <Section id="solutions">
      <SectionHeading
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        description={t("services.description")}
      />

      <div className="mt-20 space-y-24">
        {services.map((service, idx) => (
          <div
            key={service.nameKey}
            className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
              idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <Badge>{service.tag}</Badge>
              <h3 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">{t(service.nameKey)}</h3>
              <p className="mt-3 text-base leading-relaxed text-silver-400">{t(service.descriptionKey)}</p>

              <p className="mt-5 text-2xl font-semibold text-gradient">{service.price}</p>

              <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {service.featureKeys.map((fKey) => (
                  <li key={fKey} className="flex items-start gap-2.5 text-sm text-silver-300">
                    <CheckIcon />
                    {t(fKey)}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button href="#contact" variant="secondary">
                  {t("services.getStarted")}
                </Button>
              </div>
            </div>

            <div>{service.visual}</div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <AcademyCallout />
      </div>
    </Section>
  );
}
