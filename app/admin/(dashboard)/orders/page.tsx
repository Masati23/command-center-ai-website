import Link from "next/link";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  PAID: "bg-electric-500/15 text-electric-300",
  PARTIALLY_PAID: "bg-electric-500/15 text-electric-300",
  PENDING: "bg-white/[0.06] text-silver-400",
  FAILED: "bg-red-500/15 text-red-300",
  CANCELLED: "bg-white/[0.06] text-silver-500",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();

  const [orders, checkoutStarted] = await Promise.all([
    db.order.findMany({
      where: q
        ? {
            customer: {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { businessName: { contains: q, mode: "insensitive" } },
              ],
            },
          }
        : {},
      include: { customer: true, payments: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.eventLog.count({ where: { type: "checkout_started" } }),
  ]);

  const paidCount = orders.filter((o) => o.status === "PAID" || o.status === "PARTIALLY_PAID").length;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Orders &amp; Payments</h1>
          <p className="mt-1.5 text-sm text-silver-500">Every checkout, from started to paid.</p>
        </div>
        <div className="flex gap-2">
          <form action="/admin/orders" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search customer…"
              className="w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-electric-500/50"
            />
          </form>
          <a
            href="/api/admin/export/orders"
            className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-sm text-silver-300 hover:text-white"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Checkout Sessions Opened</p>
          <p className="mt-2 text-2xl font-semibold text-white">{checkoutStarted}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Completed Purchases</p>
          <p className="mt-2 text-2xl font-semibold text-white">{paidCount}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Checkout → Purchase Rate</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {checkoutStarted > 0 ? Math.round((paidCount / checkoutStarted) * 100) : 0}%
          </p>
        </GlassCard>
      </div>

      <GlassCard className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-silver-500">
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Amount Due</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Payments</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 text-silver-300 last:border-0 hover:bg-white/[0.02]">
                <td className="px-0 py-0">
                  <Link href={`/admin/orders/${o.id}`} className="block px-5 py-3">
                    {o.customer.name}
                    <span className="block text-xs text-silver-500">{o.customer.email}</span>
                  </Link>
                </td>
                <td className="px-5 py-3">{o.paymentPlanType}</td>
                <td className="px-5 py-3">{formatCents(o.amountDue)}</td>
                <td className="px-5 py-3">{formatCents(o.amountTotal)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[o.status] ?? ""}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3">{o.payments.length}</td>
                <td className="px-5 py-3">{o.createdAt.toLocaleDateString("en-US")}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-silver-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
