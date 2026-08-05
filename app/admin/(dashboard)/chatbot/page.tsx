import Link from "next/link";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminChatbotPage() {
  const [conversations, unansweredMessages, byLanguage, identifiedCount] = await Promise.all([
    db.chatConversation.findMany({
      include: { messages: { orderBy: { createdAt: "asc" } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
    db.chatMessage.findMany({
      where: { flaggedUnanswered: true },
      include: { conversation: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.chatConversation.groupBy({ by: ["language"], _count: true }),
    db.chatConversation.count({ where: { customerEmail: { not: null } } }),
  ]);

  const enCount = byLanguage.find((g) => g.language === "en")?._count ?? 0;
  const esCount = byLanguage.find((g) => g.language === "es")?._count ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Chat Insights</h1>
      <p className="mt-1.5 text-sm text-silver-500">
        {conversations.length} conversation{conversations.length === 1 ? "" : "s"} · {unansweredMessages.length}{" "}
        flagged as possibly unanswered
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">English Chats</p>
          <p className="mt-2 text-2xl font-semibold text-white">{enCount}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Spanish Chats</p>
          <p className="mt-2 text-2xl font-semibold text-white">{esCount}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Email Captured</p>
          <p className="mt-2 text-2xl font-semibold text-white">{identifiedCount}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Anonymous</p>
          <p className="mt-2 text-2xl font-semibold text-white">{conversations.length - identifiedCount}</p>
        </GlassCard>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-silver-500">
        Note: &quot;most common questions&quot; and &quot;most requested services&quot; reports aren&rsquo;t
        included here — reliably clustering free-text questions by topic needs real analysis, not a simple count,
        and a fabricated version would be misleading. The Needs Review list below and each full conversation are
        the honest way to find gaps today.
      </p>

      {unansweredMessages.length > 0 && (
        <GlassCard className="mt-6 p-5">
          <p className="text-sm font-semibold text-white">Needs Review</p>
          <p className="mt-1 text-xs text-silver-500">
            Responses the assistant flagged as uncertain — worth reviewing to fill knowledge gaps.
          </p>
          <div className="mt-4 space-y-2">
            {unansweredMessages.map((m) => (
              <Link
                key={m.id}
                href={`/admin/chatbot/${m.conversation.id}`}
                className="block rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-silver-300 hover:bg-white/[0.06]"
              >
                {m.content}
                <span className="ml-2 text-silver-500">— {m.createdAt.toLocaleString("en-US")}</span>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="mt-6 space-y-3">
        {conversations.map((c) => (
          <Link key={c.id} href={`/admin/chatbot/${c.id}`}>
            <GlassCard className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">
                  Session {c.sessionId.slice(0, 8)}…{" "}
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase text-silver-400">
                    {c.language}
                  </span>
                  {c.customerEmail && (
                    <span className="ml-2 text-xs font-normal text-silver-500">{c.customerEmail}</span>
                  )}
                </p>
                <p className="text-xs text-silver-500">{c.updatedAt.toLocaleString("en-US")}</p>
              </div>
              <div className="mt-3 space-y-1.5">
                {c.messages.slice(-4).map((m) => (
                  <p key={m.id} className="text-xs text-silver-400">
                    <span className={m.role === "user" ? "text-electric-400" : "text-silver-500"}>
                      {m.role === "user" ? "Visitor: " : "Assistant: "}
                    </span>
                    {m.content}
                  </p>
                ))}
              </div>
            </GlassCard>
          </Link>
        ))}
        {conversations.length === 0 && (
          <p className="py-8 text-center text-sm text-silver-500">
            No conversations yet — the chatbot needs ANTHROPIC_API_KEY set to go live.
          </p>
        )}
      </div>
    </div>
  );
}
