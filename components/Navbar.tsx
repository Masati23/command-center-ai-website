"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  // Absolute-path anchors (`/#solutions` not `#solutions`) so these links
  // still work correctly when the navbar renders on a page other than the
  // homepage (e.g. the Houston landing pages) — a bare `#solutions` would
  // try to scroll to an element on the current page and silently do nothing.
  const links = [
    { label: t("nav.home"), href: "/#home" },
    { label: t("nav.solutions"), href: "/#solutions" },
    { label: t("nav.pricing"), href: "/#pricing" },
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-card" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/#home" className="shrink-0" aria-label="Command Center AI home">
          <Image
            src="/logo-header.png"
            alt="Command Center AI"
            width={1146}
            height={389}
            priority
            className="h-auto w-[130px] object-contain sm:w-[150px] md:w-[170px]"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-silver-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <a
            href="https://CommandCenterAIAcademy.com"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-silver-400 transition-colors hover:text-white"
          >
            {t("nav.learnDiy")}
          </a>
          <Button href="/#contact" variant="primary" className="!px-5 !py-2.5 whitespace-nowrap">
            {t("nav.freeConsultation")}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-silver-200"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong border-t border-white/5 px-6 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-silver-200 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://CommandCenterAIAcademy.com"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-silver-400 hover:bg-white/5 hover:text-white"
            >
              {t("nav.learnDiyMobile")}
            </a>
            <Button href="/#contact" variant="primary" className="mt-3 w-full" onClick={() => setOpen(false)}>
              {t("nav.freeConsultation")}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
