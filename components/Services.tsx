"use client";

import React, { useState } from "react";
import { Section, SectionHeading, Badge, Button } from "./ui";
import AcademyCallout from "./AcademyCallout";
import ChatbotMockup from "./dashboards/ChatbotMockup";
import BookingMockup from "./dashboards/BookingMockup";
import CrmMockup from "./dashboards/CrmMockup";
import ExecutiveDashboardMockup from "./dashboards/ExecutiveDashboardMockup";
import ServicePanelMockup from "./dashboards/ServicePanelMockup";
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

// Small, consistent icon set for the 6 new services' ServicePanelMockup headers.
function HeadsetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 13a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1v-6h3M4 18v-5h3v6H6a2 2 0 0 1-2-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.77.66 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.27a2 2 0 0 1 2.11-.45c.84.32 1.71.54 2.61.66A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PipelineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h12M3 18h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InvoiceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2h9l3 3v17H6V2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6M9 17h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 0 4 5.5v14Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AgentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="8" width="16" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8V4m-3 0h6M9 14h.01M15 14h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 15l4-5 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LayoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9h18M9 9v11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LayoutBoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9h18M9 9v11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 12.5 12 16h3l-2.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type CheckoutMode = "buy" | "consultOnly";

interface Service {
  tag: string;
  nameKey: TranslationKey;
  price: string;
  // One-time website builds don't carry the recurring "monthly AI support"
  // price the AI systems below do — omit it rather than showing a
  // misleading $0/month line.
  monthlySupportPrice?: string;
  turnaroundKey?: TranslationKey;
  productSlug: string;
  descriptionKey: TranslationKey;
  featureKeys: TranslationKey[];
  visual: React.ReactNode;
  checkoutMode: CheckoutMode;
  additionalCostKey?: TranslationKey;
  // Renders a small eyebrow + intro directly above this card — used once,
  // on the first Website Development entry, to visually separate it from
  // the AI Solutions catalog above without a second page section.
  groupHeading?: { eyebrowKey: TranslationKey; titleKey: TranslationKey; descriptionKey: TranslationKey };
}

const services: Service[] = [
  {
    tag: "Service 01",
    nameKey: "services.chatbot.name",
    price: "Starting at $599",
    monthlySupportPrice: "$99/month",
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
    checkoutMode: "buy",
  },
  {
    tag: "Service 02",
    nameKey: "services.booking.name",
    price: "Starting at $899",
    monthlySupportPrice: "$199/month",
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
    checkoutMode: "buy",
  },
  {
    tag: "Service 03",
    nameKey: "services.leadgen.name",
    price: "Starting at $1,499",
    monthlySupportPrice: "$299/month",
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
    checkoutMode: "buy",
  },
  {
    tag: "Service 04",
    nameKey: "services.commandcenter.name",
    price: "Starting at $2,999",
    monthlySupportPrice: "$399/month",
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
    checkoutMode: "buy",
  },
  {
    tag: "Service 05",
    nameKey: "services.customerSupport.name",
    price: "Starting at $1,299",
    monthlySupportPrice: "$199/month",
    productSlug: "ai-customer-support-system",
    descriptionKey: "services.customerSupport.description",
    featureKeys: [
      "feature.answersSupportQuestions",
      "feature.organizesRequests",
      "feature.escalatesIssues",
      "feature.tracksFaqs",
      "feature.identifiesGaps",
    ],
    visual: (
      <ServicePanelMockup
        icon={<HeadsetIcon />}
        label="Customer Support — This Week"
        items={["18 requests answered", "2 escalated to owner", "0 unanswered questions"]}
      />
    ),
    checkoutMode: "buy",
  },
  {
    tag: "Service 06",
    nameKey: "services.voiceAgent.name",
    price: "Starting at $1,799",
    monthlySupportPrice: "$299/month + usage",
    productSlug: "ai-voice-receptionist-phone-agent",
    descriptionKey: "services.voiceAgent.description",
    featureKeys: [
      "feature.answersCalls",
      "feature.booksAppointmentsPhone",
      "feature.takesMessages",
      "feature.qualifiesCallers",
      "feature.afterHoursCoverage",
    ],
    visual: (
      <ServicePanelMockup
        icon={<PhoneIcon />}
        label="Call Activity — Today"
        items={["14 calls answered", "5 appointments booked", "3 after-hours calls covered"]}
      />
    ),
    checkoutMode: "consultOnly",
    additionalCostKey: "services.voiceUsageDisclaimer",
  },
  {
    tag: "Service 07",
    nameKey: "services.salesCrm.name",
    price: "Starting at $1,999",
    monthlySupportPrice: "$299/month",
    productSlug: "ai-sales-crm-automation",
    descriptionKey: "services.salesCrm.description",
    featureKeys: [
      "feature.capturesLeadsCrm",
      "feature.organizesCustomerInfo",
      "feature.updatesPipeline",
      "feature.sendsFollowUps",
      "feature.tracksOpportunities",
    ],
    visual: (
      <ServicePanelMockup
        icon={<PipelineIcon />}
        label="Pipeline — This Month"
        items={["32 leads captured", "11 follow-ups sent today", "6 opportunities updated"]}
      />
    ),
    checkoutMode: "consultOnly",
    additionalCostKey: "services.crmSubscriptionDisclaimer",
  },
  {
    tag: "Service 08",
    nameKey: "services.estimatesInvoicing.name",
    price: "Starting at $1,499",
    monthlySupportPrice: "$199/month",
    productSlug: "ai-estimates-invoicing",
    descriptionKey: "services.estimatesInvoicing.description",
    featureKeys: [
      "feature.createsEstimates",
      "feature.sendsInvoices",
      "feature.paymentReminders",
      "feature.tracksBalances",
      "feature.overdueAlerts",
    ],
    visual: (
      <ServicePanelMockup
        icon={<InvoiceIcon />}
        label="Invoices — This Month"
        items={["9 estimates sent", "6 invoices paid", "1 overdue reminder sent"]}
      />
    ),
    checkoutMode: "buy",
  },
  {
    tag: "Service 09",
    nameKey: "services.reputation.name",
    price: "Starting at $999",
    monthlySupportPrice: "$149/month",
    productSlug: "ai-reputation-management",
    descriptionKey: "services.reputation.description",
    featureKeys: [
      "feature.requestsReviews",
      "feature.monitorsFeedback",
      "feature.draftsResponses",
      "feature.alertsUnhappy",
      "feature.organizesReputation",
    ],
    visual: (
      <ServicePanelMockup
        icon={<StarIcon />}
        label="Reputation — This Month"
        items={["21 review requests sent", "4.8 average rating", "1 unhappy customer flagged"]}
      />
    ),
    checkoutMode: "buy",
  },
  {
    tag: "Service 10",
    nameKey: "services.employeeKnowledge.name",
    price: "Starting at $1,799",
    monthlySupportPrice: "$249/month",
    productSlug: "ai-employee-knowledge-assistant",
    descriptionKey: "services.employeeKnowledge.description",
    featureKeys: [
      "feature.answersEmployeeQuestions",
      "feature.searchesProcedures",
      "feature.explainsPolicies",
      "feature.supportsOnboarding",
      "feature.organizesTraining",
    ],
    visual: (
      <ServicePanelMockup
        icon={<BookIcon />}
        label="Internal Knowledge — This Week"
        items={["47 employee questions answered", "3 new procedures added", "2 onboarding sessions supported"]}
      />
    ),
    checkoutMode: "consultOnly",
    additionalCostKey: "services.employeeUsageDisclaimer",
  },
  {
    tag: "Service 11",
    nameKey: "services.aiAgents.name",
    price: "Starting at $3,999",
    monthlySupportPrice: "$399/month",
    productSlug: "ai-agents-for-business",
    descriptionKey: "services.aiAgents.description",
    featureKeys: [
      "feature.leadQualification",
      "feature.workflowAutomation",
      "feature.toolApiIntegrations",
      "feature.crmIntegration",
      "feature.humanApprovalSteps",
      "feature.followUpAutomation",
    ],
    visual: (
      <ServicePanelMockup
        icon={<AgentIcon />}
        label="Agent Activity — This Week"
        items={["61 tasks completed", "9 handed off for approval", "3 workflows automated"]}
      />
    ),
    checkoutMode: "buy",
    additionalCostKey: "services.aiAgentsCustomScopeNote",
  },
  {
    tag: "Service 12",
    nameKey: "services.securityHardening.name",
    price: "Starting at $3,499",
    monthlySupportPrice: "$299/month",
    productSlug: "ai-security-hardening",
    descriptionKey: "services.securityHardening.description",
    featureKeys: [
      "feature.securityReview",
      "feature.credentialProtection",
      "feature.accessControlReview",
      "feature.secretsConfiguration",
      "feature.promptInjectionMitigation",
      "feature.backupRecoveryPlanning",
    ],
    visual: (
      <ServicePanelMockup
        icon={<ShieldIcon />}
        label="Security Review — Summary"
        items={["18 checklist items reviewed", "6 access controls tightened", "1 backup plan documented"]}
      />
    ),
    checkoutMode: "buy",
    additionalCostKey: "services.securityScopeDisclaimer",
  },
  {
    tag: "Service 13",
    nameKey: "services.dataAnalytics.name",
    price: "Starting at $4,999",
    monthlySupportPrice: "$399/month",
    productSlug: "ai-data-analytics-business-intelligence",
    descriptionKey: "services.dataAnalytics.description",
    featureKeys: [
      "feature.connectsDataSources",
      "feature.customOwnerDashboard",
      "feature.definesKpis",
      "feature.salesRevenueAnalytics",
      "feature.automatedReporting",
      "feature.aiAssistedInsights",
    ],
    visual: (
      <ServicePanelMockup
        icon={<ChartIcon />}
        label="Owner Dashboard — This Month"
        items={["4 data sources connected", "12 KPIs tracked", "1 automated report sent"]}
      />
    ),
    checkoutMode: "buy",
    additionalCostKey: "services.dataAnalyticsCustomScopeNote",
  },
  {
    tag: "Website Development",
    nameKey: "services.websiteBasic.name",
    price: "Starting at $1,499",
    turnaroundKey: "services.websiteBasic.turnaround",
    productSlug: "website-professional-business",
    descriptionKey: "services.websiteBasic.description",
    featureKeys: [
      "feature.customWebsiteDesign",
      "feature.responsiveAllDevices",
      "feature.upToFiveCorePages",
      "feature.contactAndLeadForms",
      "feature.basicSeoSetup",
      "feature.googleAnalyticsIntegration",
      "feature.socialMediaIntegration",
      "feature.domainSslSetup",
      "feature.deploymentAndLaunch",
      "feature.postLaunchSupport30",
    ],
    visual: (
      <ServicePanelMockup
        icon={<LayoutIcon />}
        label="Professional Business Website"
        items={["Up to 5 core pages", "Desktop, tablet & mobile ready", "Launch in 3–5 business days"]}
      />
    ),
    checkoutMode: "buy",
    additionalCostKey: "services.websiteBasic.scopeNote",
    groupHeading: {
      eyebrowKey: "services.websiteGroup.eyebrow",
      titleKey: "services.websiteGroup.title",
      descriptionKey: "services.websiteGroup.description",
    },
  },
  {
    tag: "Website Development",
    nameKey: "services.websiteAutomation.name",
    price: "$2,999",
    turnaroundKey: "services.websiteAutomation.turnaround",
    productSlug: "website-ai-automation-package",
    descriptionKey: "services.websiteAutomation.description",
    featureKeys: [
      "feature.everythingInWebsiteBasic",
      "feature.aiChatbotConfigured",
      "feature.smartLeadCapture",
      "feature.appointmentRequestRouting",
      "feature.automatedLeadFollowUp",
      "feature.followUpWorkflowConfigured",
      "feature.crmEmailIntegrationSupported",
      "feature.aiAutomationConsultation",
    ],
    visual: (
      <ServicePanelMockup
        icon={<LayoutBoltIcon />}
        label="Website + AI Automation"
        items={["AI chatbot included", "Lead capture & follow-up", "Launch in 5–10 business days"]}
      />
    ),
    checkoutMode: "buy",
    additionalCostKey: "services.websiteAutomation.scopeNote",
  },
];

export default function Services() {
  const { t } = useLanguage();
  const [buyState, setBuyState] = useState<Record<string, "idle" | "loading" | "error">>({});

  // Still best-effort (a tracking failure should never affect the actual
  // button action), but this used to be a plain, un-awaited fetch — which
  // the browser can and does cancel when handleBuy immediately navigates
  // away via window.location.href right after. That silently dropped most
  // buy_click events (confirmed: Service Interest showed 19 checkouts
  // started but only 3 buy_click events logged). navigator.sendBeacon is
  // built exactly for "fire this as the page is unloading" — the browser
  // guarantees delivery without blocking navigation, so there's no added
  // checkout delay. Falls back to a keepalive fetch for the rare browser
  // without sendBeacon support (still best-effort, not awaited).
  function track(type: "buy_click" | "consult_click", productSlug: string) {
    const payload = JSON.stringify({ type, productSlug });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/track", blob);
      if (sent) return;
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }

  async function handleBuy(productSlug: string) {
    track("buy_click", productSlug);
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
          <React.Fragment key={service.nameKey}>
            {service.groupHeading && (
              <div className="border-t border-white/10 pt-16 text-center">
                <Badge>{t(service.groupHeading.eyebrowKey)}</Badge>
                <h3 className="mx-auto mt-5 max-w-2xl text-2xl font-semibold text-white sm:text-3xl">
                  {t(service.groupHeading.titleKey)}
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-silver-400">
                  {t(service.groupHeading.descriptionKey)}
                </p>
              </div>
            )}
            <div
              id={service.productSlug}
              className={`grid grid-cols-1 items-center gap-12 scroll-mt-28 lg:grid-cols-2 lg:gap-16 ${
                idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
            <div>
              <Badge>{service.tag}</Badge>
              <h3 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">{t(service.nameKey)}</h3>
              <p className="mt-3 text-base leading-relaxed text-silver-400">{t(service.descriptionKey)}</p>

              <p className="mt-5 text-2xl font-semibold text-gradient">{service.price}</p>
              {service.monthlySupportPrice && (
                <p className="mt-1 text-sm text-silver-400">
                  {t("services.monthlySupportFrom")} {service.monthlySupportPrice}
                </p>
              )}
              {service.turnaroundKey && (
                <p className="mt-1 text-sm text-silver-400">{t(service.turnaroundKey)}</p>
              )}

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
              {service.additionalCostKey && (
                <p className="mt-2 text-xs leading-relaxed text-silver-500">{t(service.additionalCostKey)}</p>
              )}
              {service.checkoutMode === "consultOnly" && (
                <p className="mt-2 text-xs leading-relaxed text-electric-400">{t("services.consultOnlyNote")}</p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {service.checkoutMode === "buy" && (
                  <Button type="button" variant="primary" onClick={() => handleBuy(service.productSlug)}>
                    {buyState[service.productSlug] === "loading"
                      ? t("services.buyProcessing")
                      : t("services.buyStarterPackage")}
                  </Button>
                )}
                <Button
                  href="/#contact"
                  variant="secondary"
                  onClick={() => track("consult_click", service.productSlug)}
                >
                  {t("services.freeConsultationQuote")}
                </Button>
              </div>
              {buyState[service.productSlug] === "error" && (
                <p className="mt-3 text-xs text-red-400">{t("services.buyError")}</p>
              )}
              {service.productSlug === "ai-voice-receptionist-phone-agent" && (
                <p className="mt-4 text-xs text-silver-500">
                  Serving Houston businesses —{" "}
                  <a href="/ai-receptionist-houston" className="text-electric-400 hover:underline">
                    see our AI Receptionist Houston page
                  </a>{" "}
                  or the{" "}
                  <a href="/ai-answering-service-houston" className="text-electric-400 hover:underline">
                    AI Answering Service Houston page
                  </a>
                  .
                </p>
              )}
              {service.productSlug === "ai-website-chatbot" && (
                <p className="mt-4 text-xs text-silver-500">
                  Want the bigger picture?{" "}
                  <a href="/ai-automation-houston" className="text-electric-400 hover:underline">
                    See AI automation for Houston businesses
                  </a>
                  .
                </p>
              )}
              {service.productSlug === "website-professional-business" && (
                <p className="mt-4 text-xs text-silver-500">
                  Ready to add AI on top of it?{" "}
                  <a href="#website-ai-automation-package" className="text-electric-400 hover:underline">
                    See the Website + AI Automation Package
                  </a>
                  .
                </p>
              )}
              {service.productSlug === "website-ai-automation-package" && (
                <p className="mt-4 text-xs text-silver-500">
                  {t("services.websiteAutomation.voiceUpsellNote")}{" "}
                  <a href="#ai-voice-receptionist-phone-agent" className="text-electric-400 hover:underline">
                    See the AI Voice Receptionist
                  </a>
                  . Want a fuller AI system later?{" "}
                  <a href="#ai-business-command-center" className="text-electric-400 hover:underline">
                    See the AI Business Command Center
                  </a>
                  .
                </p>
              )}
            </div>

            <div>{service.visual}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <AcademyCallout />
      </div>
    </Section>
  );
}
