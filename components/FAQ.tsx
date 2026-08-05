"use client";

import React, { useState } from "react";
import { Section, SectionHeading } from "./ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const faqs: { qKey: TranslationKey; aKey: TranslationKey }[] = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
  { qKey: "faq.q6", aKey: "faq.a6" },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLanguage();

  return (
    <Section>
      <SectionHeading eyebrow={t("faq.eyebrow")} title={t("faq.title")} />

      <div className="mx-auto mt-14 max-w-3xl space-y-4">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.qKey} className="glass overflow-hidden rounded-2xl">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium text-white">{t(item.qKey)}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`shrink-0 text-electric-400 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-silver-400">{t(item.aKey)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
