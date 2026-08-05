import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { buildChatSystemPrompt } from "@/lib/chatbot-knowledge";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

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
//   ANTHROPIC_API_KEY
//   Get it from: https://console.anthropic.com/settings/keys
//   Vercel project: command-center-ai-website
//   Environments: Production, Preview, and Development
// Without it, this route responds with a generic customer-safe message
// (never the technical reason) rather than crashing or pretending to
// work — same graceful-degradation pattern used everywhere else in this
// project (Resend, Stripe), now with the technical detail kept server-side
// only instead of reaching the response body.
// -----------------------------------------------------------------------
const anthropicConfigured = !!process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicConfigured ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { sessionId, message, language } = parsed.data;

  if (!anthropicConfigured || !anthropic) {
    // The one place this exact technical detail is allowed to exist —
    // server-side console output only.
    console.error("Chatbot request rejected: ANTHROPIC_API_KEY is not set in this environment.");
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

  await db.chatMessage.create({
    data: { conversationId: conversation.id, role: "user", content: message },
  });

  const products = await db.product.findMany({ where: { status: "ACTIVE" } });
  const systemPrompt = buildChatSystemPrompt(products, language);

  const history = conversation.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      system: systemPrompt,
      messages: [...history, { role: "user", content: message }],
    });

    const replyText = response.content.find((b) => b.type === "text")?.text ?? "";

    // Heuristic, not a guarantee — surfaces likely knowledge gaps in the
    // dashboard for a human to review, doesn't block the reply.
    const flaggedUnanswered = /not sure|don't have|no tengo información|not certain/i.test(replyText);

    await db.chatMessage.create({
      data: { conversationId: conversation.id, role: "assistant", content: replyText, flaggedUnanswered },
    });

    await db.eventLog.create({
      data: {
        type: "chatbot_message",
        refId: conversation.id,
        email: conversation.customerEmail ?? undefined,
        metadata: { flaggedUnanswered },
      },
    });

    return NextResponse.json({ reply: replyText, conversationId: conversation.id });
  } catch (err) {
    // Real cause (Anthropic API error, network failure, etc.) — server logs
    // only, per the same rule as the missing-key case above.
    console.error("Chatbot API call failed:", err);
    return NextResponse.json({ error: SAFE_UNAVAILABLE_MESSAGE[language] }, { status: 500 });
  }
}
