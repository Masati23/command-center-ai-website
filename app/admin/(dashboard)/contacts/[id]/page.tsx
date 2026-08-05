import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";
import StatusBadge from "@/components/admin/StatusBadge";
import SubmissionStatusForm from "@/components/admin/SubmissionStatusForm";

export const dynamic = "force-dynamic";

// Shared detail view for both the Contact Submissions and Consultation
// Requests dashboard sections — they read the same underlying record (see
// the ContactSubmission schema comment), so there's one detail page, not
// two that could drift out of sync.
export default async function AdminContactDetailPage({ params }: { params: { id: string } }) {
  const submission = await db.contactSubmission.findUnique({ where: { id: params.id } });
  if (!submission) notFound();

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
