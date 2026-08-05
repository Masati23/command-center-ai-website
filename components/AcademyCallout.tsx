"use client";

import React from "react";
import { GlassCard, Button } from "./ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * Cross-links to CommandCenterAIAcademy.com — the DIY/learn-it-yourself
 * sibling site. Command Center AI (this site) builds AI systems for you;
 * the Academy teaches you to build them yourself. Kept as a small,
 * clearly-labeled callout rather than blended into the main sales copy, so
 * the two offers stay distinct.
 */
export default function AcademyCallout() {
  const { t } = useLanguage();

  return (
    <GlassCard className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
      <div>
        <p className="text-sm font-semibold text-white">{t("academy.title")}</p>
        <p className="mt-1 text-sm text-silver-400">{t("academy.description")}</p>
      </div>
      <Button href="https://CommandCenterAIAcademy.com" variant="secondary" className="w-full shrink-0 sm:w-auto">
        {t("academy.button")}
      </Button>
    </GlassCard>
  );
}
