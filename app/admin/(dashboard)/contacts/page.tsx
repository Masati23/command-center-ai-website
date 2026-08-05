import Link from "next/link";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";
import StatusBadge from "@/components/admin/StatusBadge";
import { STATUS_OPTIONS } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const q = searchParams.q?.trim();
  const status = searchParams.status;

  const submissions = await db.contactSubmission.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contact Submissions</h1>
          <p className="mt-1.5 text-sm text-silver-500">Every &quot;Free AI Consultation&quot; form submission.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action="/admin/contacts" className="flex flex-wrap gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, company…"
              className="w-56 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-electric-500/50"
            />
            <select
              name="status"
              defaultValue={status ?? ""}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-electric-500/50"
            >
              <option value="" className="bg-navy-900">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-navy-900 capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-silver-300 hover:text-white">
              Filter
            </button>
          </form>
          <a
            href="/api/admin/export/contacts"
            className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-sm text-silver-300 hover:text-white"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {submissions.map((s) => (
          <Link key={s.id} href={`/admin/contacts/${s.id}`}>
            <GlassCard className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-white">
                  {s.name} <span className="font-normal text-silver-500">— {s.email}</span>
                </p>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <p className="text-xs text-silver-500">{s.createdAt.toLocaleString("en-US")}</p>
                </div>
              </div>
              {(s.phone || s.company) && (
                <p className="mt-1 text-xs text-silver-500">{[s.phone, s.company].filter(Boolean).join(" · ")}</p>
              )}
              <p className="mt-3 line-clamp-2 text-sm text-silver-300">{s.message}</p>
            </GlassCard>
          </Link>
        ))}
        {submissions.length === 0 && (
          <p className="py-8 text-center text-sm text-silver-500">No contact submissions match this filter.</p>
        )}
      </div>
    </div>
  );
}
