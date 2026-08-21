"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import AssistantPanel, { type QuickAction } from "./AssistantPanel";
import { trackAssistantEvent } from "./track";

const SESSION_KEY = "cc_chat_session_id";
// Session-only (not localStorage) so the assistant can auto-open again on
// a fresh visit later, but never more than once within the same browser
// session/tab — exactly the "once per session" behavior requested.
const AUTO_OPEN_KEY = "cc_assistant_auto_opened";
const AUTO_OPEN_DELAY_MS = 4000; // within the requested 3–5s window

interface Message {
  role: "user" | "assistant";
  content: string;
}

const copy = {
  en: {
    greeting: "Hi! I can answer questions about our AI systems, pricing, and which one fits your business. What are you looking to automate?",
    placeholder: "Type a message…",
    unavailable: "Our AI assistant is temporarily unavailable. Please try again shortly or request a free consultation.",
    title: "Command Center AI Assistant",
    // Adapted from the Command Center AI Academy chatbot's privacy notice
    // (same placement: a small line above the input box).
    privacyNotice: "Please don't share passwords, payment information, or other sensitive data.",
  },
  es: {
    greeting: "¡Hola! Puedo responder preguntas sobre nuestros sistemas de IA, precios y cuál se adapta a tu negocio. ¿Qué te gustaría automatizar?",
    placeholder: "Escribe un mensaje…",
    unavailable: "Nuestro asistente de IA no está disponible temporalmente. Inténtalo de nuevo en un momento o solicita una consulta gratuita.",
    title: "Asistente de Command Center AI",
    privacyNotice: "No compartas contraseñas, información de pago ni otros datos sensibles.",
  },
};

// Preset prompts for the panel's quick-action buttons — reuse the exact
// same sendMessage() path as anything the visitor types themselves, so
// the chatbot backend, knowledge base, and analytics all behave
// identically regardless of how the message originated.
const quickActionPrompts: Record<Exclude<QuickAction, "audit" | "book">, { en: string; es: string }> = {
  overview: {
    en: "Can you give me a quick overview of what Command Center AI offers?",
    es: "¿Puedes darme una descripción general de lo que ofrece Command Center AI?",
  },
  useCases: {
    en: "What are some real business use cases for your AI systems?",
    es: "¿Cuáles son algunos casos de uso reales de negocio para tus sistemas de IA?",
  },
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { language, t } = useLanguage(); // shared with the single site-wide language button
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // usePathname (not useSearchParams) so this never forces the page out of
  // static rendering — same reasoning as VisitorTracker.tsx. The industry
  // query param, if any, is read directly off window.location in an effect
  // instead. Only ever non-null on /missed-call-fix; every other page sends
  // no pageContext at all, so the chatbot's behavior elsewhere is unchanged.
  const pathname = usePathname();
  const [pageContext, setPageContext] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/missed-call-fix") {
      setPageContext(null);
      return;
    }
    const industry = new URLSearchParams(window.location.search).get("industry");
    setPageContext(industry ? `missed-call-fix:${industry}` : "missed-call-fix");
  }, [pathname]);

  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    setSessionId(id);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Auto-open 3–5s after landing, once per browser session, and never
  // re-triggers after the visitor closes it — sessionStorage flag is set
  // the moment the timer fires (not on close), so a visitor who never
  // even saw it still won't get a second popup later in the same tab.
  // The normal launcher button below stays available regardless.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(AUTO_OPEN_KEY)) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(AUTO_OPEN_KEY, "1");
      setOpen(true);
      trackAssistantEvent("assistant_auto_open");
    }, AUTO_OPEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function closeAssistant() {
    setOpen(false);
    trackAssistantEvent("assistant_closed");
  }

  function toggleAssistant() {
    setOpen((v) => {
      const next = !v;
      if (!next) trackAssistantEvent("assistant_closed");
      return next;
    });
  }

  async function sendMessage(e: React.FormEvent | null, overrideMessage?: string) {
    e?.preventDefault();
    const outgoing = (overrideMessage ?? input).trim();
    if (!outgoing || !sessionId || loading) return;

    const userMessage = outgoing;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userMessage, language, pageContext: pageContext ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Deliberately ignores whatever the server sent in `data.error` for
        // display — the server now always sends a customer-safe message
        // too, but the client shouldn't depend on that holding true forever.
        // Always show our own known-safe local copy instead.
        setMessages((prev) => [...prev, { role: "assistant", content: copy[language].unavailable }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: copy[language].unavailable }]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAction(action: QuickAction) {
    trackAssistantEvent("quick_action_clicked", action);

    if (action === "audit") {
      setOpen(false); // navigating away — don't leave the panel rendered open on the next page
      router.push("/assessment");
      return;
    }
    if (action === "book") {
      trackAssistantEvent("booking_opened", "quick_action");
      return; // AssistantPanel itself reveals/scrolls to the booking pane
    }

    const prompt = quickActionPrompts[action][language];
    sendMessage(null, prompt);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AssistantPanel
        open={open}
        onClose={closeAssistant}
        copy={copy[language]}
        messages={messages}
        input={input}
        setInput={setInput}
        onSubmit={sendMessage}
        loading={loading}
        scrollRef={scrollRef}
        onQuickAction={handleQuickAction}
      />

      <button
        onClick={toggleAssistant}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-electric-500 to-electric-700 shadow-glow transition-transform hover:scale-105"
        aria-label={open ? copy[language].title : t("assistant.launcherLabel")}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          // Same thinking/chat-bubble icon as the Command Center AI Academy
          // launcher — communicates "chat with the AI" more clearly than
          // the scope/bullseye logo did. Closed-state icon only; the open
          // (X) state above is unchanged.
          <span className="text-2xl leading-none" aria-hidden="true">
            💬
          </span>
        )}
      </button>
    </div>
  );
}
