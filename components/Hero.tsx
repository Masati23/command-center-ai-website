"use client";

import React from "react";
import Image from "next/image";
import { Button, Badge } from "./ui";
import HeroDashboard from "./dashboards/HeroDashboard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      {/* Centered brand logo — normal document flow (not fixed/sticky), so
          it scrolls away with the rest of the page like any other content.
          Sized as a share of the max-w-7xl container width, not the raw
          viewport, so "3/8 to nearly 1/2 of the page" holds regardless of
          how wide the visitor's screen is. */}
      <div className="relative mx-auto mb-10 flex max-w-7xl justify-center px-6 sm:mb-14 lg:px-8">
        <Image
          src="/logo-hero.png"
          alt="Command Center AI"
          width={1536}
          height={1024}
          priority
          // This approved file is a taller, more square lockup (1.5:1) than
          // the wordmark-only banner used before (3.94:1) — sizing by width
          // percentage alone at the old targets would make it roughly 2.6x
          // taller than intended and crowd the header above it, so this is
          // sized to a comparable rendered height instead, still scaling
          // responsively and never stretched (object-contain, no cropping).
          className="h-auto w-[46%] max-w-[190px] object-contain sm:w-[36%] sm:max-w-[230px] md:max-w-[260px] lg:max-w-[300px]"
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="animate-fadeUp text-center lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <Badge>{t("hero.badge")}</Badge>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("hero.headline1")} <span className="text-gradient">{t("hero.headlineGradient")}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-silver-400 lg:mx-0">
            {t("hero.subheadline")}
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button href="#contact" variant="primary" className="w-full sm:w-auto">
              {t("nav.freeConsultation")}
            </Button>
            <Button href="#solutions" variant="secondary" className="w-full sm:w-auto">
              {t("hero.ctaSecondary")}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-silver-500 lg:text-left">{t("hero.trustLine")}</p>

          <p className="mt-3 text-center text-sm lg:text-left">
            <a href="/assessment" className="font-medium text-electric-400 hover:underline">
              {t("hero.assessmentLink")}
            </a>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-silver-500 lg:justify-start">
            <span>{t("hero.location")}</span>
            <span className="h-1 w-1 rounded-full bg-silver-500" />
            <span>{t("hero.customBuilt")}</span>
            <span className="h-1 w-1 rounded-full bg-silver-500" />
            <span>{t("hero.fastDeployment")}</span>
          </div>
        </div>

        <HeroDashboard />
      </div>
    </section>
  );
}
