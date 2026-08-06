"use client";

import React from "react";
import Image from "next/image";
import { Button, Badge } from "./ui";
import HeroDashboard from "./dashboards/HeroDashboard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      {/* Centered brand logo — normal document flow (not fixed/sticky), so
          it scrolls away with the rest of the page like any other content.
          The source file was trimmed to its actual visible artwork bounds
          (the original canvas had a large amount of essentially-invisible
          transparent padding around the logo, which is why it still looked
          small even at a big CSS width) — width: clamp(280px, 80vw, 680px)
          gives a fluid ~280-380px logo on phones scaling up to a 680px cap
          on desktop, per spec. */}
      <div className="relative mx-auto mb-6 flex max-w-7xl justify-center px-6 sm:mb-8 lg:px-8">
        <Image
          src="/logo-hero.png"
          alt="Command Center AI"
          width={1136}
          height={369}
          priority
          className="h-auto w-[clamp(280px,80vw,680px)] object-contain"
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
