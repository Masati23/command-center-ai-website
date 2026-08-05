"use client";

import React, { useState } from "react";
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
  productSlug: string;
  descriptionKey: TranslationKey;
  featureKeys: TranslationKey[];
  visual: React.ReactNode;
}

const services: Service[] = [
  {
    tag: "Service 01",
    nameKey: "services.chatbot.name",
    price: "Starting at $599",
    productSlug: "ai-website-chatbot",
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
    productSlug: "ai-appointment-booking",
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
    productSlug: "ai-lead-generation",
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
    productSlug: "ai-business-command-center",
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
  const [buyState, setBuyState] = useState<Record<string, "idle" | "loading" | "error">>({});

  async function handleBuy(productSlug: string) {
    setBuyState((s) => ({ ...s, [productSlug]: "loading" }));
    try {
      const res = await fetch("/api/checkout/direct-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      console.error("Buy Starter Package failed:", err);
      setBuyState((s) => ({ ...s, [productSlug]: "error" }));
    }
  }

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

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-silver-500">
                {t("services.whatsIncluded")}
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {service.featureKeys.map((fKey) => (
                  <li key={fKey} className="flex items-start gap-2.5 text-sm text-silver-300">
                    <CheckIcon />
                    {t(fKey)}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs leading-relaxed text-silver-500">{t("services.costDisclaimer")}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleBuy(service.productSlug)}
                >
                  {buyState[service.productSlug] === "loading"
                    ? t("services.buyProcessing")
                    : t("services.buyStarterPackage")}
                </Button>
                <Button href="#contact" variant="secondary">
                  {t("services.freeConsultationQuote")}
                </Button>
              </div>
              {buyState[service.productSlug] === "error" && (
                <p className="mt-3 text-xs text-red-400">{t("services.buyError")}</p>
              )}
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
