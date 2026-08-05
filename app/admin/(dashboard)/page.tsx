import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalAssessments,
    submittedAssessments,
    totalCustomers,
    totalContacts,
    paidOrders,
    checkoutStarted,
  ] = await Promise.all([
    db.assessment.count(),
    db.assessment.count({ where: { status: "SUBMITTED" } }),
    db.customer.count(),
    db.contactSubmission.count(),
    db.order.findMany({ where: { status: { in: ["PAID", "PARTIALLY_PAID"] } } }),
    db.eventLog.count({ where: { type: "checkout_started" } }),
  ]);

  const totalRevenueCents = paidOrders.reduce((sum, o) => sum + o.amountDue, 0);

  return {
    totalAssessments,
    submittedAssessments,
    totalCustomers,
    totalContacts,
    paidOrderCount: paidOrders.length,
    totalRevenueCents,
    checkoutStarted,
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Leads (Assessments)", value: stats.totalAssessments },
    { label: "Completed Assessments", value: stats.submittedAssessments },
    { label: "Customers", value: stats.totalCustomers },
    { label: "Contact Submissions", value: stats.totalContacts },
    { label: "Checkouts Started", value: stats.checkoutStarted },
    { label: "Completed Purchases", value: stats.paidOrderCount },
    { label: "Total Revenue", value: formatCents(stats.totalRevenueCents) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-1.5 text-sm text-silver-500">Live snapshot of leads, orders, and revenue.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <GlassCard key={c.label} className="p-5">
            <p className="text-xs uppercase tracking-wide text-silver-500">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{c.value}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-6 p-5">
        <p className="text-sm font-medium text-silver-300">Not yet tracked here</p>
        <p className="mt-1.5 text-xs leading-relaxed text-silver-500">
          Chatbot conversations, unanswered chatbot questions, and Academy referral counts will appear here once
          the AI chatbot (Priority 4) and marketing/analytics tracking (Priority 7) are built — those features
          don't exist yet, so there's no data to show for them.
        </p>
      </GlassCard>
    </div>
  );
}
