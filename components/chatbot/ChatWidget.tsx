"use client";

import React, { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const SESSION_KEY = "cc_chat_session_id";

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
    privacyNotice: "Please don't share passwords, payment card information, Social Security numbers, or other sensitive information. Conversations may be reviewed to improve our support and website.",
  },
  es: {
    greeting: "¡Hola! Puedo responder preguntas sobre nuestros sistemas de IA, precios y cuál se adapta a tu negocio. ¿Qué te gustaría automatizar?",
    placeholder: "Escribe un mensaje…",
    unavailable: "Nuestro asistente de IA no está disponible temporalmente. Inténtalo de nuevo en un momento o solicita una consulta gratuita.",
    title: "Asistente de Command Center AI",
    privacyNotice: "No compartas contraseñas, información de tarjetas de pago, números de seguro social u otra información sensible. Las conversaciones pueden revisarse para mejorar nuestro soporte y sitio web.",
  },
};

// The chatbot is instructed to include real section URLs (e.g.
// https://www.commandcenterai.net/#ai-website-chatbot) when recommending a
// service — this turns those URLs into actual clickable links instead of
// inert text, satisfying "provide a clickable link... to the exact service
// section." Splits on a simple URL pattern; everything else renders as-is.
const URL_SPLIT_PATTERN = /(https?:\/\/[^\s]+)/g;
const URL_TEST_PATTERN = /^https?:\/\//;

function MessageContent({ text }: { text: string }) {
  const parts = text.split(URL_SPLIT_PATTERN);
  return (
    <>
      {parts.map((part, i) =>
        URL_TEST_PATTERN.test(part) ? (
          <a
            key={i}
            href={part}
            className="font-medium text-electric-300 underline underline-offset-2 hover:text-electric-200"
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage(); // shared with the single site-wide language button
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !sessionId || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userMessage, language }),
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-electric-500/40 bg-navy-800 shadow-card">
          <div className="flex items-center justify-between gap-2.5 bg-navy-900 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-electric-500/20">
                <LogoMark className="h-4 w-4" />
              </div>
              <p className="text-xs font-semibold text-white">{copy[language].title}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <LanguageToggle className="!px-2 !py-1 !text-[10px]" />
              <button onClick={() => setOpen(false)} className="ml-1 text-silver-400 hover:text-white" aria-label="Close chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-navy-800 px-4 py-4">
            <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-navy-700 px-3 py-2 text-[12px] text-silver-200">
              {copy[language].greeting}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] ${
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm bg-electric-600 text-white"
                    : "rounded-tl-sm bg-navy-700 text-silver-200"
                }`}
              >
                <MessageContent text={m.content} />
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1 pl-1">
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400" />
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400 [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-silver-400 [animation-delay:0.3s]" />
              </div>
            )}
          </div>

          <p className="border-t border-white/10 bg-navy-900 px-3 pt-2 text-[10px] leading-tight text-silver-500">
            {copy[language].privacyNotice}
          </p>

          <form onSubmit={sendMessage} className="flex items-center gap-2 bg-navy-900 px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy[language].placeholder}
              className="flex-1 rounded-full border border-white/10 bg-navy-700 px-3 py-2 text-[12px] text-white outline-none placeholder-silver-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric-500 disabled:opacity-50"
              aria-label="Send"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-electric-500 to-electric-700 shadow-glow transition-transform hover:scale-105"
        aria-label="Open chat"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <LogoMark className="h-7 w-7" />
        )}
      </button>
    </div>
  );
}
