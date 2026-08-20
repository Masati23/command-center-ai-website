"use client";

import React, { useEffect, useRef, useState } from "react";
import AiHostVisual from "./AiHostVisual";
import MessageContent from "./MessageContent";
import ConsultationForm from "@/components/ConsultationForm";
import LanguageToggle from "@/components/LanguageToggle";
import { LogoMark } from "@/components/Logo";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { trackAssistantEvent } from "./track";

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

interface AssistantPanelCopy {
  greeting: string;
  placeholder: string;
  privacyNotice: string;
  title: string;
}

export type QuickAction = "overview" | "useCases" | "audit" | "book";

interface AssistantPanelProps {
  open: boolean;
  onClose: () => void;
  copy: AssistantPanelCopy;
  messages: AssistantMessage[];
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  onQuickAction: (action: QuickAction) => void;
}

/**
 * The large "premium AI concierge" presentation layer. Everything
 * interactive here (messages, input, send, loading state) is owned and
 * driven by ChatWidget — this component only renders it larger and adds
 * the host visual, quick actions, and booking pane. The booking pane is
 * the exact same <ConsultationForm /> used on the homepage Contact
 * section — no second scheduling backend.
 */
export default function AssistantPanel({
  open,
  onClose,
  copy,
  messages,
  input,
  setInput,
  onSubmit,
  loading,
  scrollRef,
  onQuickAction,
}: AssistantPanelProps) {
  const { t } = useLanguage();
  const [mobileBookingOpen, setMobileBookingOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and focus lands on the panel (not trapped — Tab still
  // moves through the page normally once the visitor tabs past the panel's
  // own controls) so keyboard/screen-reader users land somewhere sensible
  // the moment the assistant opens.
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // ConsultationForm dispatches this on a successful submission — same
  // event whether it's rendered here or on the homepage Contact section,
  // so booking_completed fires accurately regardless of which one the
  // visitor used.
  useEffect(() => {
    if (!open) return;
    function handleBookingCompleted() {
      trackAssistantEvent("booking_completed");
    }
    window.addEventListener("cc:booking_completed", handleBookingCompleted);
    return () => window.removeEventListener("cc:booking_completed", handleBookingCompleted);
  }, [open]);

  if (!open) return null;

  function handleQuickAction(action: QuickAction) {
    onQuickAction(action);
    if (action === "book") {
      setMobileBookingOpen(true);
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const quickActions: { key: QuickAction; label: string }[] = [
    { key: "overview", label: t("assistant.quickActions.overview") },
    { key: "useCases", label: t("assistant.quickActions.useCases") },
    { key: "audit", label: t("assistant.quickActions.audit") },
    { key: "book", label: t("assistant.quickActions.book") },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="animate-fadeUp flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[88vh] sm:max-h-[860px] sm:w-[94vw] sm:max-w-6xl sm:rounded-3xl"
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-electric-50 to-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-electric-500/15">
              <LogoMark className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-navy-900">{copy.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle className="!bg-slate-100 !px-2.5 !py-1.5 !text-[11px] !text-navy-700 hover:!bg-slate-200 hover:!text-navy-900" />
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label={t("assistant.close")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-900"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* left: host + intro + quick actions + chat */}
          <div className="flex flex-1 flex-col overflow-hidden lg:min-w-0">
            <div className="shrink-0 border-b border-slate-100 px-5 py-6 text-center sm:px-8">
              <AiHostVisual compact />
              <h2 className="mt-4 text-lg font-semibold text-navy-900 sm:text-xl">{t("assistant.headline")}</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">{copy.greeting}</p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {quickActions.map((qa) => (
                  <button
                    key={qa.key}
                    onClick={() => handleQuickAction(qa.key)}
                    className="rounded-full border border-electric-200 bg-electric-50 px-4 py-2 text-xs font-medium text-electric-700 transition-colors hover:border-electric-400 hover:bg-electric-100"
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>

            {/* chat conversation — same message list / input as the floating widget, just larger */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-5 py-5 sm:px-8">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm">
                {copy.greeting}
              </div>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    m.role === "user"
                      ? "ml-auto rounded-tr-sm bg-electric-600 text-white"
                      : "rounded-tl-sm bg-white text-slate-700"
                  }`}
                >
                  <MessageContent
                    text={m.content}
                    linkClassName={
                      m.role === "user"
                        ? "font-medium text-white underline underline-offset-2"
                        : "font-medium text-electric-600 underline underline-offset-2 hover:text-electric-700"
                    }
                  />
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm w-fit">
                  <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-slate-400" />
                  <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-slate-400 [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-slate-400 [animation-delay:0.3s]" />
                </div>
              )}
            </div>

            <p className="shrink-0 border-t border-slate-100 bg-white px-5 pt-2.5 text-[10.5px] leading-tight text-slate-400 sm:px-8">
              {copy.privacyNotice}
            </p>

            <form onSubmit={onSubmit} className="flex shrink-0 items-center gap-2.5 bg-white px-5 py-4 sm:px-8">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={copy.placeholder}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy-900 outline-none transition-colors placeholder-slate-400 focus:border-electric-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-electric-500 to-electric-700 shadow-glow transition-transform hover:scale-105 disabled:opacity-50"
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>

          {/* right (desktop) / below (mobile): booking, beside the assistant */}
          <div
            ref={bookingRef}
            className={`shrink-0 border-t border-slate-100 bg-navy-900 lg:w-[360px] lg:overflow-y-auto lg:border-l lg:border-t-0 ${
              mobileBookingOpen ? "block" : "hidden lg:block"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setMobileBookingOpen((v) => {
                  const next = !v;
                  if (next) trackAssistantEvent("booking_opened", "mobile_accordion");
                  return next;
                })
              }
              className="flex w-full items-center justify-between px-5 py-4 text-left lg:hidden"
              aria-expanded={mobileBookingOpen}
            >
              <span className="text-sm font-semibold text-white">{t("assistant.bookingTab")}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className={`transition-transform ${mobileBookingOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={`px-5 pb-6 sm:px-6 ${mobileBookingOpen ? "block" : "hidden lg:block"}`}>
              <p className="hidden text-sm font-semibold text-white lg:block">{t("assistant.bookingTitle")}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-silver-400">{t("assistant.bookingSubtitle")}</p>
              <div className="mt-4">
                <ConsultationForm compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
