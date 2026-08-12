"use client";

import React from "react";
import { LogoFull } from "./Logo";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <LogoFull markClassName="h-10 w-10" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-silver-400">{t("footer.tagline")}</p>
            <p className="mt-1 text-sm font-medium tracking-wide text-electric-400">{t("footer.taglineSecondary")}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">{t("footer.navigate")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-silver-400">
              <li><a href="/#home" className="hover:text-white">{t("nav.home")}</a></li>
              <li><a href="/#solutions" className="hover:text-white">{t("nav.solutions")}</a></li>
              <li><a href="/#pricing" className="hover:text-white">{t("nav.pricing")}</a></li>
              <li><a href="/#about" className="hover:text-white">{t("nav.about")}</a></li>
              <li><a href="/assessment" className="hover:text-white">{t("footer.assessment")}</a></li>
              <li><a href="/#contact" className="hover:text-white">{t("nav.contact")}</a></li>
              <li>
                <a href="https://CommandCenterAIAcademy.com" className="hover:text-white">
                  {t("footer.academy")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">{t("footer.contact")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-silver-400">
              <li>
                <a href="mailto:commandcenterai.contact@gmail.com" className="hover:text-white">
                  commandcenterai.contact@gmail.com
                </a>
              </li>
              <li>{t("hero.location")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-8">
          <h4 className="text-sm font-semibold text-white">AI Solutions in Houston</h4>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-silver-400">
            <li><a href="/ai-receptionist-houston" className="hover:text-white">AI Receptionist Houston</a></li>
            <li><a href="/ai-automation-houston" className="hover:text-white">AI Automation Houston</a></li>
            <li><a href="/ai-answering-service-houston" className="hover:text-white">AI Answering Service Houston</a></li>
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-silver-500">
            &copy; {year} Command Center AI. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-silver-500">
            <a href="/legal/privacy" className="hover:text-white">{t("footer.privacy")}</a>
            <a href="/legal/terms" className="hover:text-white">{t("footer.terms")}</a>
            <a href="/legal/refund-policy" className="hover:text-white">{t("footer.refund")}</a>
            <span>{t("hero.location")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
