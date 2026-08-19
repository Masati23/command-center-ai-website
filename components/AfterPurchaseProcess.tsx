"use client";

import React from "react";
import { Section, SectionHeading, GlassCard } from "./ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

// One global explanation of what happens after checkout, shown once between
// the service catalog and pricing — replaces repeating onboarding copy
// inside every individual service module.
const steps: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "afterPurchase.step1.title", bodyKey: "afterPurchase.step1.body" },
  { titleKey: "afterPurchase.step2.title", bodyKey: "afterPurchase.step2.body" },
  { titleKey: "afterPurchase.step3.title", bodyKey: "afterPurchase.step3.body" },
  { titleKey: "afterPurchase.step4.title", bodyKey: "afterPurchase.step4.body" },
  { titleKey: "afterPurchase.step5.title", bodyKey: "afterPurchase.step5.body" },
];

export default function AfterPurchaseProcess() {
  const { t } = useLanguage();

  return (
    <Section id="after-purchase">
      <SectionHeading
        eyebrow={t("afterPurchase.eyebrow")}
        title={t("afterPurchase.title")}
        description={t("afterPurchase.description")}
      />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <GlassCard key={step.titleKey} className="p-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-500/15 text-sm font-semibold text-electric-400">
              {i + 1}
            </span>
            <h3 className="mt-4 text-sm font-semibold text-white">{t(step.titleKey)}</h3>
            <p className="mt-2 text-xs leading-relaxed text-silver-400">{t(step.bodyKey)}</p>
          </GlassCard>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-silver-500">
        {t("afterPurchase.timeline")}
      </p>

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-silver-400">
        {t("assessment.secondaryCta")}{" "}
        <a href="/assessment" className="font-medium text-electric-400 hover:underline">
          {t("assessment.secondaryCta.link")}
        </a>
      </p>
    </Section>
  );
}
