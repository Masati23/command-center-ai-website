"use client";

import React from "react";
import { Section, SectionHeading, GlassCard } from "./ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-electric-400">
      <rect x="4" y="10" width="16" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-electric-400">
      <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10h20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-electric-400">
      <path d="M6 2h9l5 5v15H6V2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-electric-400">
      <path d="M4 13a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1v-6h3M4 18v-5h3v6H6a2 2 0 0 1-2-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Customer-facing trust/security section, placed right after Pricing so
 * it's visible near the purchase decision. Every claim here is verified
 * against the actual implementation (Stripe Checkout's hosted page, the
 * Prisma schema's Payment/Customer/ContactSubmission/ChatMessage models) —
 * see the commit this file was added in for the verification notes.
 * Deliberately avoids absolute claims ("100% secure", "unhackable") per
 * the same honesty standard used in the chatbot's system prompt.
 */
export default function TrustSecurity() {
  const { t } = useLanguage();

  const cards = [
    { icon: <LockIcon />, titleKey: "trust.payments.title", bodyKey: "trust.payments.body" },
    { icon: <CardIcon />, titleKey: "trust.checkout.title", bodyKey: "trust.checkout.body" },
    { icon: <FileIcon />, titleKey: "trust.customerInfo.title", bodyKey: "trust.customerInfo.body" },
    { icon: <HeadsetIcon />, titleKey: "trust.support.title", bodyKey: "trust.support.body" },
  ] as const;

  return (
    <Section id="trust">
      <SectionHeading
        eyebrow={t("trust.eyebrow")}
        title={t("trust.title")}
        description={t("trust.description")}
      />

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <GlassCard key={c.titleKey} className="p-6">
            <div className="flex items-center gap-3">
              {c.icon}
              <p className="text-sm font-semibold uppercase tracking-wide text-white">{t(c.titleKey)}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-silver-400">{t(c.bodyKey)}</p>
          </GlassCard>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-silver-500">🔒 {t("trust.poweredByStripe")}</p>
    </Section>
  );
}
