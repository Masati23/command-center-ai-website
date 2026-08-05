"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/** English/Español switch. English is the default; the choice persists via localStorage (see LanguageContext). */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-0.5 rounded-lg bg-white/[0.04] p-0.5 ${className}`}>
      <button
        onClick={() => setLanguage("en")}
        className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
          language === "en" ? "bg-white/15 text-white" : "text-silver-400 hover:text-white"
        }`}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("es")}
        className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
          language === "es" ? "bg-white/15 text-white" : "text-silver-400 hover:text-white"
        }`}
        aria-pressed={language === "es"}
      >
        ES
      </button>
    </div>
  );
}
