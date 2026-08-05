import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminChatConversationPage({ params }: { params: { id: string } }) {
  const conversation = await db.chatConversation.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conversation) notFound();

  return (
    <div>
      <Link href="/admin/chatbot" className="text-xs text-silver-400 hover:text-white">
        ← Back to Chat Insights
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Conversation {conversation.sessionId.slice(0, 8)}…</h1>
          <p className="mt-1 text-sm text-silver-400">
            Started {conversation.startedAt.toLocaleString("en-US")} · Last activity{" "}
            {conversation.updatedAt.toLocaleString("en-US")}
          </p>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs uppercase text-silver-400">
          {conversation.language === "es" ? "Spanish" : "English"}
        </span>
      </div>

      {conversation.customerEmail ? (
        <GlassCard className="mt-6 p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Customer email (voluntarily provided)</p>
          <a href={`mailto:${conversation.customerEmail}`} className="mt-1 block text-sm text-electric-400 hover:underline">
            {conversation.customerEmail}
          </a>
        </GlassCard>
      ) : (
        <GlassCard className="mt-6 p-5">
          <p className="text-sm text-silver-400">Anonymous — no email was volunteered in this conversation.</p>
        </GlassCard>
      )}

      <GlassCard className="mt-6 space-y-3 p-6">
        {conversation.messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
            m.role === "user" ? "ml-auto bg-electric-600 text-white" : "bg-navy-700 text-silver-200"
          }`}>
            {m.content}
            {m.flaggedUnanswered && (
              <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-wide text-amber-300">
                Flagged — needs review
              </span>
            )}
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
