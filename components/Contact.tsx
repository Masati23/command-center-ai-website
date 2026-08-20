"use client";

import React from "react";
import { Section, SectionHeading, GlassCard } from "./ui";
import ConsultationForm from "./ConsultationForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <Section id="contact">
      <SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} description={t("contact.description")} />

      <p className="mx-auto mt-6 max-w-xl text-center text-sm text-silver-400">
        {t("assessment.secondaryCta")}{" "}
        <a href="/assessment" className="font-medium text-electric-400 hover:underline">
          {t("assessment.secondaryCta.link")}
        </a>
      </p>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
        {/* contact info */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-electric-500/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2">
                <path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-5 text-lg font-semibold text-white">{t("contact.card.company")}</p>

            <div className="mt-8 space-y-5">
              <a href="mailto:commandcenterai.contact@gmail.com" className="flex items-center gap-3 text-sm text-silver-300 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2">
                  <path d="M4 4h16v16H4V4Zm0 0 8 9 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                commandcenterai.contact@gmail.com
              </a>
              <div className="flex items-center gap-3 text-sm text-silver-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t("hero.location")}
              </div>
            </div>

            <p className="mt-8 border-t border-white/5 pt-6 text-xs leading-relaxed text-silver-500">
              {t("contact.card.formNote")}
            </p>
          </GlassCard>
        </div>

        {/* form */}
        <div className="lg:col-span-3">
          <GlassCard className="p-8">
            <ConsultationForm />
          </GlassCard>
        </div>
      </div>
    </Section>
  );
}
