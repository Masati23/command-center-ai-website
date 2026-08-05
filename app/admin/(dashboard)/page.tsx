import Link from "next/link";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";
import ReorderableStatGrid, { type StatCardData } from "@/components/admin/ReorderableStatGrid";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function describeEvent(e: { type: string; email: string | null; metadata: unknown; createdAt: Date }): string {
  const meta = (e.metadata as Record<string, any>) ?? {};
  switch (e.type) {
    case "contact_submitted":
      return `${meta.name ?? "Someone"}${meta.company ? ` (${meta.company})` : ""} submitted the Free AI Consultation form`;
    case "status_changed":
      return `${e.email ?? "A lead"}'s status changed from ${meta.from} to ${meta.to}`;
    case "note_updated":
      return `A note was added for ${e.email ?? "a lead"}`;
    case "chatbot_message":
      return `Chat activity${e.email ? ` from ${e.email}` : " (anonymous)"}${meta.flaggedUnanswered ? " — flagged for review" : ""}`;
    case "checkout_started":
      return `Checkout started${e.email ? ` by ${e.email}` : ""}${meta.productSlug ? ` for ${meta.productSlug}` : ""}`;
    case "payment_succeeded":
      return `Payment succeeded${e.email ? ` — ${e.email}` : ""}`;
    case "buy_click":
      return `Buy Starter Package clicked (${meta.productSlug ?? "unknown service"})`;
    case "consult_click":
      return `Free Consultation clicked (${meta.productSlug ?? "unknown service"})`;
    default:
      return e.type.replace(/_/g, " ");
  }
}

async function getStats() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const [
    totalAssessments,
    totalCustomers,
    totalContacts,
    contactsToday,
    contactsThisWeek,
    contactsThisMonth,
    allOrders,
    paidOrders,
    paidOrdersToday,
    paidOrdersThisMonth,
    checkoutStarted,
    buyClicks,
    consultClicks,
    chatConversations,
    chatMessages,
    activeChatSessions,
    chatByLanguage,
    unansweredCount,
    referralGroups,
    paidItemsWithProduct,
    recentEvents,
  ] = await Promise.all([
    db.assessment.count(),
    db.customer.count(),
    db.contactSubmission.count(),
    db.contactSubmission.count({ where: { createdAt: { gte: startOfToday } } }),
    db.contactSubmission.count({ where: { createdAt: { gte: startOfWeek } } }),
    db.contactSubmission.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.count(),
    db.order.findMany({ where: { status: { in: ["PAID", "PARTIALLY_PAID"] } } }),
    db.order.findMany({ where: { status: { in: ["PAID", "PARTIALLY_PAID"] }, createdAt: { gte: startOfToday } } }),
    db.order.findMany({ where: { status: { in: ["PAID", "PARTIALLY_PAID"] }, createdAt: { gte: startOfMonth } } }),
    db.eventLog.count({ where: { type: "checkout_started" } }),
    db.eventLog.count({ where: { type: "buy_click" } }),
    db.eventLog.count({ where: { type: "consult_click" } }),
    db.chatConversation.count(),
    db.chatMessage.count(),
    db.chatConversation.count({ where: { updatedAt: { gte: fiveMinutesAgo } } }),
    db.chatConversation.groupBy({ by: ["language"], _count: true }),
    db.chatMessage.count({ where: { flaggedUnanswered: true } }),
    db.contactSubmission.groupBy({ by: ["referralSource"], _count: true, where: { referralSource: { not: null } } }),
    db.orderItem.findMany({
      where: { order: { status: { in: ["PAID", "PARTIALLY_PAID"] } } },
      include: { product: true },
    }),
    db.eventLog.findMany({ orderBy: { createdAt: "desc" }, take: 15 }),
  ]);

  const totalRevenueCents = paidOrders.reduce((sum, o) => sum + o.amountDue, 0);
  const revenueTodayCents = paidOrdersToday.reduce((sum, o) => sum + o.amountDue, 0);
  const revenueThisMonthCents = paidOrdersThisMonth.reduce((sum, o) => sum + o.amountDue, 0);
  const avgOrderValueCents = paidOrders.length > 0 ? Math.round(totalRevenueCents / paidOrders.length) : 0;
  const checkoutConversionPct = checkoutStarted > 0 ? Math.round((paidOrders.length / checkoutStarted) * 100) : 0;

  const revenueByProduct = new Map<string, number>();
  for (const item of paidItemsWithProduct) {
    revenueByProduct.set(item.product.name, (revenueByProduct.get(item.product.name) ?? 0) + item.price);
  }
  const topProduct = [...revenueByProduct.entries()].sort((a, b) => b[1] - a[1])[0];

  const topReferral = [...referralGroups].sort((a, b) => (b._count as number) - (a._count as number))[0];
  // referralSource is stored from the request's Referer header — visitor
  // input, not guaranteed to be a well-formed absolute URL, so this must
  // not throw and take the whole dashboard down over one malformed value.
  let topTrafficSource = "Direct / Unknown";
  if (topReferral?.referralSource) {
    try {
      topTrafficSource = new URL(topReferral.referralSource).hostname || topReferral.referralSource;
    } catch {
      topTrafficSource = topReferral.referralSource;
    }
  }

  const enChats = chatByLanguage.find((g) => g.language === "en")?._count ?? 0;
  const esChats = chatByLanguage.find((g) => g.language === "es")?._count ?? 0;

  return {
    totalAssessments,
    totalCustomers,
    totalContacts,
    contactsToday,
    contactsThisWeek,
    contactsThisMonth,
    totalOrders: allOrders,
    paidOrderCount: paidOrders.length,
    totalRevenueCents,
    revenueTodayCents,
    revenueThisMonthCents,
    avgOrderValueCents,
    checkoutStarted,
    buyClicks,
    consultClicks,
    checkoutConversionPct,
    chatConversations,
    chatMessages,
    activeChatSessions,
    enChats,
    esChats,
    unansweredCount,
    topProduct,
    topTrafficSource,
    recentEvents,
  };
}

export default async function AdminOverviewPage() {
  const [s, session] = await Promise.all([getStats(), getSession()]);

  // Deliberately the only place this is touched — see the schema comment
  // on AdminUser.lastSeenAt. Fire-and-forget: a failure here shouldn't
  // block the page from rendering.
  if (session) {
    db.adminUser.update({ where: { id: session.adminId }, data: { lastSeenAt: new Date() } }).catch(() => {});
  }

  const executiveCards: StatCardData[] = [
    { id: "totalRevenue", label: "Total Revenue", value: formatCents(s.totalRevenueCents), href: "/admin/orders", tooltip: "Sum of amountDue across all PAID/PARTIALLY_PAID orders, all time." },
    { id: "revenueToday", label: "Revenue Today", value: formatCents(s.revenueTodayCents), href: "/admin/orders", tooltip: "Same, filtered to orders created since midnight today (server local time)." },
    { id: "revenueThisMonth", label: "Revenue This Month", value: formatCents(s.revenueThisMonthCents), href: "/admin/orders", tooltip: "Same, filtered to orders created since the 1st of this month." },
    { id: "totalOrders", label: "Total Orders", value: s.totalOrders, href: "/admin/orders", tooltip: "Every order regardless of status — pending, failed, and canceled included." },
    { id: "totalLeads", label: "Total Leads", value: s.totalContacts, href: "/admin/contacts", tooltip: "Total Contact Submissions — the primary lead source today." },
    { id: "newLeadsToday", label: "New Leads Today", value: s.contactsToday, href: "/admin/contacts", tooltip: "Contact submissions created since midnight today." },
    { id: "consultationRequests", label: "Consultation Requests", value: s.totalContacts, href: "/admin/consultations", tooltip: "Same submissions as Total Leads — one form serves both today." },
    { id: "conversionRate", label: "Conversion Rate", value: `${s.checkoutConversionPct}%`, tooltip: "Completed purchases ÷ checkout sessions opened." },
    { id: "avgOrderValue", label: "Average Order Value", value: formatCents(s.avgOrderValueCents), tooltip: "Total revenue ÷ number of paid orders." },
    { id: "topService", label: "Top Performing Service", value: s.topProduct ? s.topProduct[0] : "—", href: "/admin/service-interest", tooltip: "The service with the most revenue from completed purchases." },
    { id: "topTraffic", label: "Top Traffic Source", value: s.topTrafficSource, tooltip: "Most common referring page across contact form submissions — a partial signal, not full attribution. Enable Vercel Web Analytics for complete referral/UTM data." },
    { id: "liveVisitors", label: "Live Visitor Count", value: s.activeChatSessions, tooltip: "Approximation, not true site-wide presence: chat conversations active in the last 5 minutes. Vercel Web Analytics can show real-time visitor count for the whole site." },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Executive Dashboard</h1>
      <p className="mt-1.5 text-sm text-silver-500">
        Everything that matters, at a glance. Every number links to where it came from.
      </p>

      <div className="mt-6">
        <ReorderableStatGrid cards={executiveCards} />
      </div>

      <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-silver-500">Recent Activity</p>
      <GlassCard className="mt-3 p-0">
        <div className="divide-y divide-white/5">
          {s.recentEvents.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <span className="text-silver-300">{describeEvent(e)}</span>
              <span className="whitespace-nowrap text-xs text-silver-500">{e.createdAt.toLocaleString("en-US")}</span>
            </div>
          ))}
          {s.recentEvents.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-silver-500">No activity yet.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard className="mt-6 border-electric-500/20 p-5">
        <p className="text-sm font-medium text-white">Visitor traffic (visitors, page views, device, geo)</p>
        <p className="mt-1.5 text-xs leading-relaxed text-silver-400">
          Tracked by Vercel Web Analytics — enable it once in your Vercel project (Analytics tab), no code changes
          needed. Top Traffic Source and Live Visitor Count above are honest approximations from this app&rsquo;s
          own data until then.
        </p>
      </GlassCard>

      <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-silver-500">Chat</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/chatbot">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wide text-silver-500">Chat Conversations</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.chatConversations}</p>
          </GlassCard>
        </Link>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Chat Messages</p>
          <p className="mt-2 text-2xl font-semibold text-white">{s.chatMessages}</p>
        </GlassCard>
        <Link href="/admin/chatbot">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wide text-silver-500">Needs Review</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.unansweredCount}</p>
          </GlassCard>
        </Link>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">EN / ES Split</p>
          <p className="mt-2 text-2xl font-semibold text-white">{s.enChats} / {s.esChats}</p>
        </GlassCard>
      </div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-silver-500">Checkout &amp; Clicks</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/service-interest">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wide text-silver-500">Buy Starter Package Clicks</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.buyClicks}</p>
          </GlassCard>
        </Link>
        <Link href="/admin/service-interest">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wide text-silver-500">Free Consultation Clicks</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.consultClicks}</p>
          </GlassCard>
        </Link>
        <Link href="/admin/orders">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wide text-silver-500">Checkout Sessions Opened</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.checkoutStarted}</p>
          </GlassCard>
        </Link>
        <Link href="/admin/orders">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wide text-silver-500">Completed Purchases</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.paidOrderCount}</p>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
