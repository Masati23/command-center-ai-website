"use client";

import React, { useState } from "react";
import { Section, SectionHeading, GlassCard, Button } from "./ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useLanguage();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || t("contact.form.errorGeneric"));
      }
      setStatus("success");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || t("contact.form.errorGeneric"));
    }
  }

  return (
    <Section id="contact">
      <SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} description={t("contact.description")} />

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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot — hidden from real visitors via CSS (not type="hidden",
                  which bots specifically know to skip), invisible to screen
                  readers via aria-hidden + tabIndex, never rendered visibly. */}
              <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-silver-400">
                    {t("contact.form.name")}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none transition-colors focus:border-electric-500/50"
                    placeholder={t("contact.form.namePlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-silver-400">
                    {t("contact.form.email")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none transition-colors focus:border-electric-500/50"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-silver-400">
                    {t("contact.form.phone")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none transition-colors focus:border-electric-500/50"
                    placeholder="(555) 555-5555"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-xs font-medium text-silver-400">
                    {t("contact.form.company")}
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none transition-colors focus:border-electric-500/50"
                    placeholder={t("contact.form.companyPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-silver-400">
                  {t("contact.form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none transition-colors focus:border-electric-500/50"
                  placeholder={t("contact.form.messagePlaceholder")}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                {status === "loading" ? t("contact.form.sending") : t("contact.form.submit")}
              </Button>
              <p className="text-center text-xs text-silver-500">{t("hero.trustLine")}</p>

              {status === "success" && (
                <p className="text-center text-sm font-medium text-electric-400">{t("contact.form.success")}</p>
              )}
              {status === "error" && <p className="text-center text-sm font-medium text-red-400">{errorMsg}</p>}
            </form>
          </GlassCard>
        </div>
      </div>
    </Section>
  );
}
