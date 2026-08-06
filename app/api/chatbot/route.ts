import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { buildChatSystemPrompt } from "@/lib/chatbot-knowledge";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { redactSensitiveInfo } from "@/lib/chat-redaction";
import { decideRecommendedService } from "@/lib/service-matcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1).max(2000),
  language: z.enum(["en", "es"]).default("en"),
});

// Customer-facing fallback for any chatbot failure — configuration missing,
// rate limited, or a genuine API error. Never technical, never mentions env
// var names, credentials, or internals. The real reason always goes to
// console.error only (Vercel Function Logs — "secure server logs"), never
// into a response body a browser can read.
const SAFE_UNAVAILABLE_MESSAGE = {
  en: "Our AI assistant is temporarily unavailable. Please try again shortly or request a free consultation.",
  es: "Nuestro asistente de IA no está disponible temporalmente. Inténtalo de nuevo en un momento o solicita una consulta gratuita.",
};

// -----------------------------------------------------------------------
// CREDENTIAL NEEDED TO ACTIVATE THIS ROUTE:
//   OPENAI_API_KEY
//   Get it from: https://platform.openai.com/api-keys
//   Vercel project: command-center-ai-website
//   Environments: Production, Preview, and Development
//
// Uses OpenAI (gpt-4o-mini) via a plain fetch to OpenAI's REST API — no SDK
// dependency — matching the proven, already-working architecture from the
// Command Center AI Academy project (cc-stripe/lib/chat.ts). This project
// previously used Anthropic's API; switched to reuse the same working setup
// rather than maintain two different chatbot architectures.
//
// Without the key, this route responds with a generic customer-safe message
// (never the technical reason) rather than crashing or pretending to work —
// same graceful-degradation pattern used everywhere else in this project
// (Resend, Stripe).
// -----------------------------------------------------------------------
const openaiConfigured = !!process.env.OPENAI_API_KEY;

async function getChatReply(
  systemPrompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  message: string
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...history.slice(-16), { role: "user", content: message }],
      max_tokens: 500,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenAI error:", res.status, errText);
    throw new Error("Chat request failed");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { sessionId, message, language } = parsed.data;

  if (!openaiConfigured) {
    // The one place this exact technical detail is allowed to exist —
    // server-side console output only.
    console.error("Chatbot request rejected: OPENAI_API_KEY is not set in this environment.");
    return NextResponse.json({ error: SAFE_UNAVAILABLE_MESSAGE[language] }, { status: 503 });
  }

  if (isRateLimited(getClientIp(req), 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: SAFE_UNAVAILABLE_MESSAGE[language] }, { status: 429 });
  }

  const conversation = await db.chatConversation.upsert({
    where: { sessionId },
    update: { language },
    create: { sessionId, language },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
  });

  // Deterministic, model-independent match on the visitor's own message —
  // same architecture as the Academy project's course-matcher.ts. Computed
  // from the raw message (redaction below is for storage only, so it
  // doesn't affect matching or what the model sees).
  const recommendedServiceSlug = decideRecommendedService(message);

  await db.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: redactSensitiveInfo(message),
      recommendedServiceSlug,
    },
  });

  const products = await db.product.findMany({ where: { status: "ACTIVE" } });
  const systemPrompt = buildChatSystemPrompt(products, language);

  const history = conversation.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  try {
    const replyText = await getChatReply(systemPrompt, history, message);

    // Heuristic, not a guarantee — surfaces likely knowledge gaps in the
    // dashboard for a human to review, doesn't block the reply.
    const flaggedUnanswered = /not sure|don't have|no tengo información|not certain/i.test(replyText);

    await db.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: redactSensitiveInfo(replyText),
        flaggedUnanswered,
      },
    });

    await db.eventLog.create({
      data: {
        type: "chatbot_message",
        refId: conversation.id,
        email: conversation.customerEmail ?? undefined,
        metadata: { flaggedUnanswered, recommendedServiceSlug },
      },
    });

    return NextResponse.json({ reply: replyText, conversationId: conversation.id });
  } catch (err) {
    // Real cause (OpenAI API error, network failure, etc.) — server logs
    // only, per the same rule as the missing-key case above.
    console.error("Chatbot API call failed:", err);
    return NextResponse.json({ error: SAFE_UNAVAILABLE_MESSAGE[language] }, { status: 500 });
  }
}
