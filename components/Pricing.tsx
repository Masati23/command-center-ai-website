"use client";

import React from "react";
import { Section, SectionHeading, GlassCard, Button } from "./ui";
import AcademyCallout from "./AcademyCallout";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

interface Package {
  nameKey: TranslationKey;
  tagKey?: TranslationKey;
  price: string;
  descriptionKey: TranslationKey;
  featureKeys: TranslationKey[];
  highlighted?: boolean;
}

const packages: Package[] = [
  {
    nameKey: "pricing.starter.name",
    tagKey: "pricing.starter.tag",
    price: "Starting at $599",
    descriptionKey: "pricing.starter.description",
    featureKeys: ["pkgFeature.chatbot247", "pkgFeature.leadCapture", "pkgFeature.faqAutomation", "pkgFeature.emailNotifications"],
  },
  {
    nameKey: "pricing.growth.name",
    tagKey: "pricing.growth.tag",
    price: "Starting at $1,499",
    descriptionKey: "pricing.growth.description",
    featureKeys: ["pkgFeature.everythingStarter", "pkgFeature.leadGenSystem", "pkgFeature.followUpSequences", "pkgFeature.pipelineTracking"],
    highlighted: true,
  },
  {
    nameKey: "pricing.business.name",
    tagKey: "pricing.business.tag",
    price: "Starting at $2,999",
    descriptionKey: "pricing.business.description",
    featureKeys: ["pkgFeature.everythingGrowth", "pkgFeature.execDashboard", "pkgFeature.fullWorkflow", "pkgFeature.analyticsReports"],
  },
];

interface SupportTier {
  name: string;
  price: string;
  featureKeys: TranslationKey[];
  highlighted?: boolean;
}

const supportTiers: SupportTier[] = [
  {
    name: "Basic",
    price: "Starting at $99/month",
    featureKeys: ["supportFeature.monitoring", "supportFeature.healthCheck", "supportFeature.minorUpdates", "supportFeature.emailSupport"],
  },
  {
    name: "Growth",
    price: "Starting at $149/month",
    featureKeys: [
      "supportFeature.everythingBasic",
      "supportFeature.priorityResponse",
      "supportFeature.performanceReport",
      "supportFeature.workflowAdjustments",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "Starting at $249/month",
    featureKeys: [
      "supportFeature.everythingGrowth",
      "supportFeature.dedicatedLine",
      "supportFeature.ongoingOptimization",
      "supportFeature.quarterlyReview",
    ],
  },
];

const supportIncludes: { titleKey: TranslationKey; descriptionKey: TranslationKey }[] = [
  { titleKey: "included.hosting.title", descriptionKey: "included.hosting.description" },
  { titleKey: "included.modelUpdates.title", descriptionKey: "included.modelUpdates.description" },
  { titleKey: "included.knowledgeBase.title", descriptionKey: "included.knowledgeBase.description" },
  { titleKey: "included.monitoring.title", descriptionKey: "included.monitoring.description" },
  { titleKey: "included.bugFixes.title", descriptionKey: "included.bugFixes.description" },
  { titleKey: "included.usageAnalytics.title", descriptionKey: "included.usageAnalytics.description" },
  { titleKey: "included.emailSupport.title", descriptionKey: "included.emailSupport.description" },
  { titleKey: "included.prioritySupport.title", descriptionKey: "included.prioritySupport.description" },
];

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <Section id="pricing">
      <SectionHeading eyebrow={t("pricing.eyebrow")} title={t("pricing.title")} description={t("pricing.description")} />

      <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-silver-500">
        {t("pricing.scopeClarification")}
      </p>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {packages.map((pkg) => (
          <GlassCard
            key={pkg.nameKey}
            className={`flex flex-col p-8 ${pkg.highlighted ? "border-electric-500/40 shadow-glow md:-translate-y-3" : ""}`}
          >
            {pkg.highlighted && (
              <span className="mb-4 w-fit rounded-full bg-electric-500/15 px-3 py-1 text-xs font-medium text-electric-400">
                {t("pricing.mostPopular")}
              </span>
            )}
            <h3 className="text-xl font-semibold text-white">{t(pkg.nameKey)}</h3>
            {pkg.tagKey && <p className="mt-1 text-sm text-electric-400">{t(pkg.tagKey)}</p>}
            <p className="mt-5 text-3xl font-semibold text-white">{pkg.price}</p>
            <p className="mt-3 text-sm leading-relaxed text-silver-400">{t(pkg.descriptionKey)}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {pkg.featureKeys.map((fKey) => (
                <li key={fKey} className="flex items-start gap-2.5 text-sm text-silver-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0 text-electric-400">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t(fKey)}
                </li>
              ))}
            </ul>

            <Button href="/#contact" variant={pkg.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
              {t("pricing.freeConsultation")}
            </Button>
          </GlassCard>
        ))}
      </div>

      {/* Monthly Support Plans */}
      <div className="mt-28">
        <SectionHeading
          eyebrow={t("pricing.support.eyebrow")}
          title={t("pricing.support.title")}
          description={t("pricing.support.description")}
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {supportTiers.map((tier) => (
            <GlassCard
              key={tier.name}
              className={`flex flex-col p-8 ${tier.highlighted ? "border-electric-500/40 shadow-glow md:-translate-y-3" : ""}`}
            >
              <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
              <p className="mt-4 text-3xl font-semibold text-white">{tier.price}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.featureKeys.map((fKey) => (
                  <li key={fKey} className="flex items-start gap-2.5 text-sm text-silver-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0 text-electric-400">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t(fKey)}
                  </li>
                ))}
              </ul>

              <Button href="/#contact" variant={tier.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
                {t("pricing.support.choose")} {tier.name}
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* What's included in Monthly Support & Hosting */}
      <div className="mt-28">
        <SectionHeading
          eyebrow={t("pricing.included.eyebrow")}
          title={t("pricing.included.title")}
          description={t("pricing.included.description")}
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supportIncludes.map((item) => (
            <GlassCard key={item.titleKey} className="p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric-500/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">{t(item.titleKey)}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-silver-400">{t(item.descriptionKey)}</p>
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
