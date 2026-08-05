import Link from "next/link";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();

  const assessments = await db.assessment.findMany({
    where: {
      status: "SUBMITTED",
      ...(q
        ? {
            customer: {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { businessName: { contains: q, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    },
    include: { customer: true, score: true },
    orderBy: { submittedAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Leads</h1>
          <p className="mt-1.5 text-sm text-silver-500">Every completed AI Business Assessment.</p>
        </div>
        <div className="flex gap-2">
          <form action="/admin/leads" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, business…"
              className="w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-electric-500/50"
            />
          </form>
          <a
            href="/api/admin/export/leads"
            className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-sm text-silver-300 hover:text-white"
          >
            Export CSV
          </a>
        </div>
      </div>

      <GlassCard className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-silver-500">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Business</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Readiness</th>
              <th className="px-5 py-3">Complexity</th>
              <th className="px-5 py-3">Submitted</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a.id} className="border-b border-white/5 text-silver-300 last:border-0">
                <td className="px-5 py-3">{a.customer?.name ?? "—"}</td>
                <td className="px-5 py-3">{a.customer?.businessName ?? "—"}</td>
                <td className="px-5 py-3">{a.customer?.email ?? "—"}</td>
                <td className="px-5 py-3">{a.score?.overallReadinessScore ?? "—"}</td>
                <td className="px-5 py-3 capitalize">{a.score?.complexityTier ?? "—"}</td>
                <td className="px-5 py-3">{a.submittedAt?.toLocaleDateString("en-US") ?? "—"}</td>
                <td className="px-5 py-3">
                  <Link href={`/assessment/results/${a.id}`} className="text-electric-400 hover:underline" target="_blank">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {assessments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-silver-500">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
