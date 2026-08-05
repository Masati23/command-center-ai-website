"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * Single-button language switch. Always shows the language you'd switch
 * TO, never both options at once — English site shows "🌐 Español",
 * Spanish site shows "🌐 English". Shared LanguageContext means this same
 * control (wherever it's rendered — nav, mobile nav, chat widget) drives
 * the whole site, including the chatbot, from one persisted preference.
 */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const nextLanguage = language === "en" ? "es" : "en";
  const label = language === "en" ? "Español" : "English";

  return (
    <button
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      className={`flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-silver-300 transition-colors hover:bg-white/[0.08] hover:text-white ${className}`}
      aria-label={`Switch language to ${label}`}
    >
      <span aria-hidden="true">🌐</span>
      {label}
    </button>
  );
}
