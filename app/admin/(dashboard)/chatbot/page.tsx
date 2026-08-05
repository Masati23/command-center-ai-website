import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminChatbotPage() {
  const conversations = await db.chatConversation.findMany({
    include: { messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  const unansweredMessages = await db.chatMessage.findMany({
    where: { flaggedUnanswered: true },
    include: { conversation: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Chatbot Conversations</h1>
      <p className="mt-1.5 text-sm text-silver-500">
        {conversations.length} conversation{conversations.length === 1 ? "" : "s"} · {unansweredMessages.length}{" "}
        flagged as possibly unanswered
      </p>

      {unansweredMessages.length > 0 && (
        <GlassCard className="mt-6 p-5">
          <p className="text-sm font-semibold text-white">Unanswered Questions</p>
          <p className="mt-1 text-xs text-silver-500">
            Responses the assistant flagged as uncertain — worth reviewing to fill knowledge gaps.
          </p>
          <div className="mt-4 space-y-2">
            {unansweredMessages.map((m) => (
              <div key={m.id} className="rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-silver-300">
                {m.content}
                <span className="ml-2 text-silver-500">— {m.createdAt.toLocaleString("en-US")}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="mt-6 space-y-3">
        {conversations.map((c) => (
          <GlassCard key={c.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-white">
                Session {c.sessionId.slice(0, 8)}…{" "}
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase text-silver-400">
                  {c.language}
                </span>
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
