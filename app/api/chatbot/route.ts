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

// -----------------------------------------------------------------------
// CREDENTIAL NEEDED TO ACTIVATE THIS ROUTE:
//   ANTHROPIC_API_KEY
//   Get it from: https://console.anthropic.com/settings/keys
//   Vercel project: command-center-ai-website
//   Environments: Production, Preview, and Development
// Without it, this route responds with a clear 503 rather than crashing or
// pretending to work — same graceful-degradation pattern used everywhere
// else in this project (Resend, Stripe).
// -----------------------------------------------------------------------
const anthropicConfigured = !!process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicConfigured ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

export async function POST(req: NextRequest) {
  if (!anthropicConfigured || !anthropic) {
    return NextResponse.json(
      { error: "The chat assistant isn't configured yet. Set ANTHROPIC_API_KEY to enable it." },
      { status: 503 }
    );
  }

  if (isRateLimited(getClientIp(req), 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Please slow down a bit." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { sessionId, message, language } = parsed.data;

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
      data: { type: "chatbot_message", refId: conversation.id, metadata: { flaggedUnanswered } },
    });

    return NextResponse.json({ reply: replyText, conversationId: conversation.id });
  } catch (err) {
    console.error("Chatbot API call failed:", err);
    return NextResponse.json({ error: "The assistant is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
