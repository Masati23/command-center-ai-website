"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, type TranslationKey } from "./translations";

export type Language = "en" | "es";
const STORAGE_KEY = "cc_language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // English is always the default — matches on first paint (server and
  // client) so there's no hydration mismatch; the stored preference (if
  // any) is applied after mount.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") {
      setLanguageState(stored);
    }
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function t(key: TranslationKey): string {
    return translations[key]?.[language] ?? translations[key]?.en ?? key;
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Sensible fallback rather than a hard crash if a component ever
    // renders outside the provider (shouldn't happen — it wraps the root
    // layout — but this keeps a stray usage from taking down the page).
    return { language: "en", setLanguage: () => {}, t: (key) => translations[key]?.en ?? key };
  }
  return ctx;
}
