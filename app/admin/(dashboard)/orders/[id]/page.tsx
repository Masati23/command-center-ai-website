import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-electric-500/15 text-electric-300",
  PARTIALLY_PAID: "bg-electric-500/15 text-electric-300",
  PENDING: "bg-white/[0.06] text-silver-400",
  FAILED: "bg-red-500/15 text-red-300",
  CANCELLED: "bg-white/[0.06] text-silver-500",
};

/** Only a real Stripe object id (pi_..., cs_...) makes a valid Dashboard link — the webhook falls back to synthetic ids like session_xxx / invoice_xxx for subscription-mode events, which don't exist as Stripe payment intents and would be a broken link. */
function stripeDashboardUrl(paymentIntentId: string | null | undefined): string | null {
  if (!paymentIntentId || !paymentIntentId.startsWith("pi_")) return null;
  return `https://dashboard.stripe.com/test/payments/${paymentIntentId}`;
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { customer: true, payments: true, items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="text-xs text-silver-400 hover:text-white">
        ← Back to Orders &amp; Payments
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Order {order.id.slice(0, 8)}…</h1>
          <p className="mt-1 text-sm text-silver-400">
            {order.customer.name} ·{" "}
            <a href={`mailto:${order.customer.email}`} className="hover:text-white">
              {order.customer.email}
            </a>
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status] ?? ""}`}>
          {order.status}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Items</p>
            <div className="mt-3 space-y-2">
              {order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm text-silver-200">
                    <span>{item.product.name}</span>
                    <span>{formatCents(item.price)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-silver-500">Custom project — no catalog line items (proposal-based order).</p>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
              <span className="text-silver-400">Total due this order</span>
              <span className="font-semibold text-white">{formatCents(order.amountDue)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-silver-400">Full project value</span>
              <span className="text-silver-300">{formatCents(order.amountTotal)}</span>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Payments</p>
            <div className="mt-3 space-y-3">
              {order.payments.map((p) => {
                const dashboardUrl = stripeDashboardUrl(p.stripePaymentIntentId);
                return (
                  <div key={p.id} className="rounded-lg bg-white/[0.03] p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white">{formatCents(p.amount)}</span>
                      <span className="text-xs text-silver-500">{p.createdAt.toLocaleString("en-US")}</span>
                    </div>
                    <p className="mt-1 text-xs text-silver-500">Status: {p.status}</p>
                    {dashboardUrl && (
                      <a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-electric-400 hover:underline">
                        View in Stripe Dashboard →
                      </a>
                    )}
                    {p.receiptUrl && (
                      <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="ml-3 mt-1 inline-block text-xs text-electric-400 hover:underline">
                        Receipt →
                      </a>
                    )}
                  </div>
                );
              })}
              {order.payments.length === 0 && <p className="text-sm text-silver-500">No payments recorded yet.</p>}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Order details</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-silver-500">Path</dt>
              <dd className="text-silver-200">{order.path}</dd>
            </div>
            <div>
              <dt className="text-xs text-silver-500">Payment plan</dt>
              <dd className="text-silver-200">{order.paymentPlanType}</dd>
            </div>
            <div>
              <dt className="text-xs text-silver-500">Created</dt>
              <dd className="text-silver-200">{order.createdAt.toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt className="text-xs text-silver-500">Last updated</dt>
              <dd className="text-silver-200">{order.updatedAt.toLocaleString("en-US")}</dd>
            </div>
          </dl>
        </GlassCard>
      </div>
    </div>
  );
}
