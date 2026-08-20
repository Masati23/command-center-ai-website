"use client";

import React, { useState } from "react";
import { Button } from "./ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Status = "idle" | "loading" | "success" | "error";

// The single implementation of the "book a consultation" flow — posts to
// the existing /api/contact route, same as it always has. Extracted out of
// Contact.tsx so the new large AI assistant panel's booking pane can reuse
// this exact form/logic instead of standing up a second one. No new
// backend, no new scheduling system — just one component rendered in two
// places.
export default function ConsultationForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { t, language } = useLanguage();

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
      language,
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
      // Best-effort completion signal for the assistant panel's booking
      // pane — a plain DOM CustomEvent so this component stays decoupled
      // from any particular parent (Contact.tsx doesn't need to listen).
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cc:booking_completed"));
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || t("contact.form.errorGeneric"));
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none transition-colors focus:border-electric-500/50";
  const labelClass = "mb-1.5 block text-xs font-medium text-silver-400";

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      {/* Honeypot — hidden from real visitors via CSS (not type="hidden",
          which bots specifically know to skip), invisible to screen
          readers via aria-hidden + tabIndex, never rendered visibly. */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor={`website-${compact ? "compact" : "full"}`}>Website</label>
        <input id={`website-${compact ? "compact" : "full"}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? "gap-4" : "gap-5"}`}>
        <div>
          <label htmlFor={`name-${compact ? "compact" : "full"}`} className={labelClass}>
            {t("contact.form.name")}
          </label>
          <input
            id={`name-${compact ? "compact" : "full"}`}
            name="name"
            type="text"
            required
            className={fieldClass}
            placeholder={t("contact.form.namePlaceholder")}
          />
        </div>
        <div>
          <label htmlFor={`email-${compact ? "compact" : "full"}`} className={labelClass}>
            {t("contact.form.email")}
          </label>
          <input
            id={`email-${compact ? "compact" : "full"}`}
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? "gap-4" : "gap-5"}`}>
        <div>
          <label htmlFor={`phone-${compact ? "compact" : "full"}`} className={labelClass}>
            {t("contact.form.phone")}
          </label>
          <input
            id={`phone-${compact ? "compact" : "full"}`}
            name="phone"
            type="tel"
            className={fieldClass}
            placeholder="(555) 555-5555"
          />
        </div>
        <div>
          <label htmlFor={`company-${compact ? "compact" : "full"}`} className={labelClass}>
            {t("contact.form.company")}
          </label>
          <input
            id={`company-${compact ? "compact" : "full"}`}
            name="company"
            type="text"
            className={fieldClass}
            placeholder={t("contact.form.companyPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`message-${compact ? "compact" : "full"}`} className={labelClass}>
          {t("contact.form.message")}
        </label>
        <textarea
          id={`message-${compact ? "compact" : "full"}`}
          name="message"
          required
          rows={compact ? 3 : 4}
          className={`${fieldClass} resize-none`}
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
  );
}
