import Link from "next/link";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminServiceInterestPage() {
  const [products, buyClicks, consultClicks, checkoutEvents, expiredEvents, paidItems] = await Promise.all([
    db.product.findMany({ where: { category: "CORE", status: "ACTIVE" }, orderBy: { sortOrder: "asc" } }),
    db.eventLog.findMany({ where: { type: "buy_click" } }),
    db.eventLog.findMany({ where: { type: "consult_click" } }),
    db.eventLog.findMany({ where: { type: "checkout_started" } }),
    db.eventLog.findMany({ where: { type: "checkout_expired" } }),
    db.orderItem.findMany({
      where: { order: { status: { in: ["PAID", "PARTIALLY_PAID"] } } },
      include: { product: true },
    }),
  ]);

  function slugFromEvent(e: { refId: string | null; metadata: unknown }): string | null {
    const meta = e.metadata as { productSlug?: string } | null;
    return meta?.productSlug ?? e.refId ?? null;
  }

  const rows = products.map((p) => {
    const buys = buyClicks.filter((e) => slugFromEvent(e) === p.slug).length;
    const consults = consultClicks.filter((e) => slugFromEvent(e) === p.slug).length;
    const checkouts = checkoutEvents.filter((e) => slugFromEvent(e) === p.slug).length;
    const expired = expiredEvents.filter((e) => slugFromEvent(e) === p.slug).length;
    const purchases = paidItems.filter((i) => i.productId === p.id);
    const revenueCents = purchases.reduce((sum, i) => sum + i.price, 0);
    const conversionPct = buys > 0 ? Math.round((purchases.length / buys) * 100) : 0;

    return { product: p, buys, consults, checkouts, expired, purchaseCount: purchases.length, revenueCents, conversionPct };
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Service Interest</h1>
      <p className="mt-1.5 text-sm text-silver-500">
        How each of the {products.length} services performs — clicks, checkouts, purchases, and revenue.
      </p>

      <GlassCard className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-silver-500">
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Buy Clicks</th>
              <th className="px-5 py-3">Consult Clicks</th>
              <th className="px-5 py-3">Checkouts Started</th>
              <th className="px-5 py-3">Expired</th>
              <th className="px-5 py-3">Purchases</th>
              <th className="px-5 py-3">Revenue</th>
              <th className="px-5 py-3">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.product.id} className="border-b border-white/5 text-silver-300 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <a
                    href={`https://www.commandcenterai.net/#${r.product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white hover:text-electric-400"
                  >
                    {r.product.name}
                  </a>
                </td>
                <td className="px-5 py-3">{r.buys}</td>
                <td className="px-5 py-3">{r.consults}</td>
                <td className="px-5 py-3">{r.checkouts}</td>
                <td className="px-5 py-3">{r.expired}</td>
                <td className="px-5 py-3">{r.purchaseCount}</td>
                <td className="px-5 py-3">{formatCents(r.revenueCents)}</td>
                <td className="px-5 py-3">{r.conversionPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <p className="mt-4 text-xs leading-relaxed text-silver-500">
        Buy/Consult clicks are logged the moment a button is clicked, before the visitor necessarily finishes
        anything — that's intentional, so you can see interest even where it didn't convert. &ldquo;Expired&rdquo;
        counts checkouts where Stripe&rsquo;s own session expired (its default is ~24h after creation with no
        completed payment) — a real signal the visitor didn&rsquo;t finish, not a guess. A checkout can show as
        neither Expired nor Purchased yet if it&rsquo;s still within that window.{" "}
        <Link href="/admin" className="text-electric-400 hover:underline">
          ← Back to Overview
        </Link>
      </p>
    </div>
  );
}
