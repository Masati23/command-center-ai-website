import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";
import StatusBadge from "@/components/admin/StatusBadge";
import SubmissionStatusForm from "@/components/admin/SubmissionStatusForm";
import Timeline, { type TimelineEntry } from "@/components/admin/Timeline";

export const dynamic = "force-dynamic";

function describeEventForTimeline(type: string, metadata: unknown): string | null {
  const meta = (metadata as Record<string, any>) ?? {};
  switch (type) {
    case "status_changed":
      return `Status changed from ${meta.from} to ${meta.to}`;
    case "note_updated":
      return "A follow-up note was added";
    case "chatbot_message":
      return `Chatbot conversation${meta.flaggedUnanswered ? " — a response was flagged for review" : ""}`;
    case "checkout_started":
      return `Stripe checkout started${meta.productSlug ? ` for ${meta.productSlug}` : ""}`;
    case "payment_succeeded":
      return "Purchase completed";
    default:
      return null; // contact_submitted is covered by the submission itself, not duplicated here
  }
}

// Shared detail view for both the Contact Submissions and Consultation
// Requests dashboard sections — they read the same underlying record (see
// the ContactSubmission schema comment), so there's one detail page, not
// two that could drift out of sync.
export default async function AdminContactDetailPage({ params }: { params: { id: string } }) {
  const submission = await db.contactSubmission.findUnique({ where: { id: params.id } });
  if (!submission) notFound();

  // Everything correlated by email — see the EventLog.email schema
  // comment. This is the whole Customer Timeline query: three sources,
  // merged and sorted client-side (well within reason at this volume).
  const [events, conversations, orders] = await Promise.all([
    db.eventLog.findMany({ where: { email: submission.email }, orderBy: { createdAt: "asc" } }),
    db.chatConversation.findMany({ where: { customerEmail: submission.email }, orderBy: { startedAt: "asc" } }),
    db.order.findMany({ where: { customer: { email: submission.email } }, orderBy: { createdAt: "asc" } }),
  ]);

  const timelineEntries: TimelineEntry[] = [
    { timestamp: submission.createdAt, label: "Submitted the Free AI Consultation form", detail: submission.referralSource ? `Referred from: ${submission.referralSource}` : undefined },
    ...conversations.map((c) => ({
      timestamp: c.startedAt,
      label: "Started a chatbot conversation",
      detail: `${c.language === "es" ? "Spanish" : "English"} · session ${c.sessionId.slice(0, 8)}…`,
      href: `/admin/chatbot/${c.id}`,
    })),
    ...orders.map((o) => ({
      timestamp: o.createdAt,
      label: "Checkout order created",
      detail: `${formatCents(o.amountDue)} · ${o.status}`,
      href: `/admin/orders/${o.id}`,
    })),
    ...events
      .map((e) => {
        const label = describeEventForTimeline(e.type, e.metadata);
        return label ? { timestamp: e.createdAt, label } : null;
      })
      .filter((e): e is TimelineEntry => !!e),
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const fields: { label: string; value: string | null }[] = [
    { label: "Phone", value: submission.phone },
    { label: "Company", value: submission.company },
    { label: "Service interest", value: submission.serviceInterest },
    { label: "Budget", value: submission.budget },
    { label: "Preferred contact method", value: submission.preferredContactMethod },
    { label: "Preferred contact time", value: submission.preferredContactTime },
    { label: "Language", value: submission.language === "es" ? "Spanish" : "English" },
    { label: "Referral source", value: submission.referralSource },
  ];

  return (
    <div>
      <Link href="/admin/contacts" className="text-xs text-silver-400 hover:text-white">
        ← Back to Contact Submissions
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">{submission.name}</h1>
          <p className="mt-1 text-sm text-silver-400">
            <a href={`mailto:${submission.email}`} className="hover:text-white">
              {submission.email}
            </a>{" "}
            · Submitted {submission.createdAt.toLocaleString("en-US")}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Message / business need</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-silver-200">{submission.message}</p>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Details</p>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-silver-500">{f.label}</dt>
                  <dd className="mt-0.5 text-sm text-silver-200">{f.value || "—"}</dd>
                </div>
              ))}
            </dl>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Timeline</p>
            <p className="mt-1 text-xs text-silver-500">
              Every touchpoint tied to this email — form submission, chats, checkouts, purchases, and status
              changes. Note: this doesn&rsquo;t include anonymous page views before the visitor was identified —
              that requires page-level analytics tracking, which isn&rsquo;t built (see Vercel Web Analytics for
              site-wide traffic instead).
            </p>
            <div className="mt-5">
              <Timeline entries={timelineEntries} />
            </div>
          </GlassCard>
        </div>

        <GlassCard className="h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Manage</p>
          <div className="mt-4">
            <SubmissionStatusForm id={submission.id} initialStatus={submission.status} initialNotes={submission.ownerNotes ?? ""} />
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-white/5 pt-6">
            <a
              href={`mailto:${submission.email}`}
              className="rounded-lg border border-white/10 px-3 py-2 text-center text-sm text-silver-300 hover:text-white"
            >
              Email
            </a>
            {submission.phone && (
              <a
                href={`tel:${submission.phone}`}
                className="rounded-lg border border-white/10 px-3 py-2 text-center text-sm text-silver-300 hover:text-white"
              >
                Call
              </a>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
