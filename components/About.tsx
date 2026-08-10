"use client";

import React from "react";
import { Section, Badge, GlassCard } from "./ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const stats: { value: string; labelKey: TranslationKey }[] = [
  { value: "24/7", labelKey: "about.stat.coverage" },
  { value: "13", labelKey: "about.stat.coreSystems" },
  { value: "100%", labelKey: "about.stat.customConfigured" },
];

export default function About() {
  const { t } = useLanguage();

  return (
    <Section id="about">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <Badge>{t("about.eyebrow")}</Badge>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("about.title")}</h2>
          <p className="mt-6 text-lg leading-relaxed text-silver-400">{t("about.paragraph1")}</p>
          <p className="mt-4 text-lg leading-relaxed text-silver-400">{t("about.paragraph2")}</p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.labelKey}>
                <p className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-silver-500">{t(s.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-500/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2">
                <path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold tracking-wide text-white">{t("about.standard.heading")}</p>
          </div>
          <p className="mt-6 text-base leading-relaxed text-silver-300">&ldquo;{t("about.quote")}&rdquo;</p>
          <div className="mt-6 border-t border-white/5 pt-6 text-sm text-silver-400">
            <p className="font-medium text-silver-300">Command Center AI</p>
            <p>{t("hero.location")}</p>
            <a href="mailto:commandcenterai.contact@gmail.com" className="text-electric-400 hover:underline">
              commandcenterai.contact@gmail.com
            </a>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
