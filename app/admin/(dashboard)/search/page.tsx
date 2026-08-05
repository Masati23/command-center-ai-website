import Link from "next/link";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminSearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? "";

  if (!q) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white">Search</h1>
        <p className="mt-1.5 text-sm text-silver-500">Use the search bar above to look up a lead, customer, or order.</p>
      </div>
    );
  }

  const [submissions, orders] = await Promise.all([
    db.contactSubmission.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
          { company: { contains: q, mode: "insensitive" } },
          { ownerNotes: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.order.findMany({
      where: {
        customer: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { businessName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        },
      },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const totalResults = submissions.length + orders.length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Search results for &quot;{q}&quot;</h1>
      <p className="mt-1.5 text-sm text-silver-500">{totalResults} result{totalResults === 1 ? "" : "s"} across leads and orders.</p>

      {submissions.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Leads / Contacts / Consultations ({submissions.length})</p>
          <div className="mt-3 space-y-3">
            {submissions.map((s) => (
              <Link key={s.id} href={`/admin/contacts/${s.id}`}>
                <GlassCard className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {s.name} <span className="font-normal text-silver-500">— {s.email}</span>
                    </p>
                    <StatusBadge status={s.status} />
                  </div>
                  {(s.phone || s.company) && (
                    <p className="mt-1 text-xs text-silver-500">{[s.phone, s.company].filter(Boolean).join(" · ")}</p>
                  )}
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Orders ({orders.length})</p>
          <div className="mt-3 space-y-3">
            {orders.map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`}>
                <GlassCard className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {o.customer.name} <span className="font-normal text-silver-500">— {o.customer.email}</span>
                    </p>
                    <span className="text-xs text-silver-500">{formatCents(o.amountDue)} · {o.status}</span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      {totalResults === 0 && <p className="mt-8 text-sm text-silver-500">No matches for &quot;{q}&quot;.</p>}
    </div>
  );
}
