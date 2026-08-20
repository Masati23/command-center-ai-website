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
 * The AI assistant panel's presentation layer. Everything interactive here
 * (messages, input, send, loading state) is owned and driven by ChatWidget
 * — this component only renders it, plus the host visual, quick actions,
 * and a collapsible booking section. The booking section is the exact
 * same <ConsultationForm /> used on the homepage Contact section — no
 * second scheduling backend.
 *
 * Desktop: a compact floating panel anchored to the bottom-right, sized
 * like a slightly-enlarged premium chatbot rather than a page takeover —
 * the site stays visible behind it. Mobile: a near full-screen sheet,
 * since there's no room for a floating widget on small viewports. One
 * unified navy/electric palette throughout (chat + booking) instead of a
 * light chat area bolted to a dark contact panel.
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
  const [bookingOpen, setBookingOpen] = useState(false);
  // "Conversation mode" — once the visitor clicks a quick action or sends
  // their first message, the welcome block (host visual + headline +
  // greeting paragraph) collapses down to a slim status bar so the actual
  // message history gets the panel's real estate instead of getting
  // squeezed into whatever was left over.
  const [conversationMode, setConversationMode] = useState(false);
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

  // Booking section stays collapsed until the visitor asks for it — it no
  // longer occupies a permanent slice of the panel on every screen size.
  // Conversation mode resets too, so reopening the assistant later starts
  // fresh on the full welcome layout again.
  useEffect(() => {
    if (!open) {
      setBookingOpen(false);
      setConversationMode(false);
    }
  }, [open]);

  // Safety net — if messages ever exist (e.g. a quick action populated the
  // conversation) make sure we're in conversation mode, regardless of how
  // that happened.
  useEffect(() => {
    if (messages.length > 0) setConversationMode(true);
  }, [messages.length]);

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
    setConversationMode(true);
    onQuickAction(action);
    if (action === "book") {
      setBookingOpen(true);
      requestAnimationFrame(() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    if (input.trim()) setConversationMode(true);
    onSubmit(e);
  }

  function toggleBooking() {
    setBookingOpen((v) => {
      const next = !v;
      if (next) trackAssistantEvent("booking_opened", "toggle");
      return next;
    });
  }

  // Only the two highest-intent actions — "Get an Overview" and "See
  // Business Use Cases" were dropped on every screen size as repetitive
  // with the intro line and the conversation itself.
  const quickActions: { key: QuickAction; label: string }[] = [
    { key: "audit", label: t("assistant.quickActions.audit") },
    { key: "book", label: t("assistant.quickActions.book") },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-end bg-navy-950/70 backdrop-blur-sm p-0 lg:bg-transparent lg:p-6 lg:backdrop-blur-none"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="animate-fadeUp flex h-full w-full flex-col overflow-hidden bg-navy-900 shadow-2xl ring-1 ring-white/10 lg:h-[640px] lg:max-h-[82vh] lg:w-[400px] lg:rounded-3xl lg:shadow-glow"
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-navy-900 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-500/15">
              <LogoMark className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-white">{copy.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle className="!px-2.5 !py-1.5 !text-[11px]" />
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label={t("assistant.close")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-silver-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/*
          body — a non-scrolling flex column. Every section here is
          shrink-0 EXCEPT the message list, which is the only flex-1 (and
          min-h-0, so flex actually lets it shrink to the space that's
          left instead of pushing the input/privacy notice off-panel).
          That's what gives messages their own dedicated, independently
          scrollable area that can never render underneath the quick
          actions or get clipped by the footer.
        */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* welcome / host — full block until the conversation starts, then
              collapses to a slim status bar so messages get the space back */}
          {conversationMode ? (
            <div className="shrink-0 border-b border-white/5 px-5 py-2">
              <AiHostVisual mini />
            </div>
          ) : (
            <div className="shrink-0 border-b border-white/5 px-5 py-3 text-center">
              <AiHostVisual compact />
              {/* One short intro line, same on every screen size — the
                  header already names the assistant and the status pill
                  already says it's online, so the old headline + long
                  greeting paragraph were purely repetitive. */}
              <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-silver-400">{t("assistant.intro")}</p>
            </div>
          )}

          {/* quick actions — always visible, always above the conversation */}
          <div className="shrink-0 border-b border-white/5 px-5 py-2.5">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((qa) => (
                <button
                  key={qa.key}
                  onClick={() => handleQuickAction(qa.key)}
                  className={`rounded-xl border border-electric-500/20 bg-electric-500/[0.08] font-medium leading-tight text-electric-300 transition-colors hover:border-electric-400/40 hover:bg-electric-500/15 hover:text-electric-200 ${
                    conversationMode ? "px-2.5 py-1.5 text-[10.5px]" : "px-3 py-2 text-[11.5px]"
                  }`}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* collapsible booking — hidden until "Book a Consultation" is clicked, so it never dominates the panel */}
          <div ref={bookingRef} className={`shrink-0 border-b border-white/5 ${bookingOpen ? "block" : "hidden"}`}>
            <div className="flex items-center justify-between px-5 pt-4">
              <div>
                <p className="text-sm font-semibold text-white">{t("assistant.bookingTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-silver-400">{t("assistant.bookingSubtitle")}</p>
              </div>
              <button
                type="button"
                onClick={toggleBooking}
                aria-label={t("assistant.close")}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-silver-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="px-5 pb-5 pt-3">
              <ConsultationForm compact />
            </div>
          </div>

          {/* chat conversation — the only flex-1 in this column, so it's the
              only thing that grows/shrinks to fill remaining space and
              scroll on its own */}
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-navy-950/40 px-5 py-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-navy-800 px-4 py-2.5 text-sm text-silver-100 shadow-sm">
              {copy.greeting}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm bg-electric-600 text-white"
                    : "rounded-tl-sm bg-navy-800 text-silver-100"
                }`}
              >
                <MessageContent
                  text={m.content}
                  linkClassName={
                    m.role === "user"
                      ? "font-medium text-white underline underline-offset-2"
                      : "font-medium text-electric-300 underline underline-offset-2 hover:text-electric-200"
                  }
                />
              </div>
            ))}
            {loading && (
              <div className="flex w-fit items-center gap-1 rounded-2xl bg-navy-800 px-4 py-3 shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400" />
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400 [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400 [animation-delay:0.3s]" />
              </div>
            )}
          </div>

          <p className="shrink-0 border-t border-white/5 bg-navy-900 px-5 pt-2.5 text-[10.5px] leading-tight text-silver-500">
            {copy.privacyNotice}
          </p>

          <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2.5 bg-navy-900 px-5 py-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy.placeholder}
              className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder-silver-500 focus:border-electric-400/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-electric-500 to-electric-700 shadow-glow transition-transform hover:scale-105 disabled:opacity-50"
              aria-label="Send"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
