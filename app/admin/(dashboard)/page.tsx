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
    paidItemsWithProduct,
    recentEvents,
    totalVisitors,
    uniqueVisitorsToday,
    liveVisitors,
    totalPageViews,
    pageViewsToday,
    sourceBucketGroups,
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
    db.orderItem.findMany({
      where: { order: { status: { in: ["PAID", "PARTIALLY_PAID"] } } },
      include: { product: true },
    }),
    db.eventLog.findMany({ orderBy: { createdAt: "desc" }, take: 15 }),
    db.visitor.count(),
    db.visitor.count({ where: { lastSeenAt: { gte: startOfToday } } }),
    db.visitor.count({ where: { lastSeenAt: { gte: fiveMinutesAgo } } }),
    db.pageView.count(),
    db.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
    db.visitor.groupBy({ by: ["sourceBucket"], _count: true }),
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

  // Real, site-wide traffic source data (Visitor.sourceBucket, computed at
  // first touch from UTM params / referrer — see lib/tracking.ts). Replaces
  // the old approximation that only looked at contact-form referrer
  // headers, which meant a visitor who never submitted a form never
  // contributed to this number at all.
  const sourceBucketCounts = Object.fromEntries(sourceBucketGroups.map((g) => [g.sourceBucket, g._count as number]));
  const topSourceBucket = [...sourceBucketGroups].sort((a, b) => (b._count as number) - (a._count as number))[0];
  const SOURCE_LABELS: Record<string, string> = {
    tiktok: "TikTok",
    youtube: "YouTube",
    facebook: "Facebook",
    instagram: "Instagram",
    google: "Google / Search",
    direct: "Direct",
    other: "Other",
  };
  const topTrafficSource = topSourceBucket ? SOURCE_LABELS[topSourceBucket.sourceBucket] ?? topSourceBucket.sourceBucket : "No visitors yet";

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
    totalVisitors,
    uniqueVisitorsToday,
    liveVisitors,
    totalPageViews,
    pageViewsToday,
    sourceBucketCounts,
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
    { id: "topTraffic", label: "Top Traffic Source", value: s.topTrafficSource, href: "/admin/traffic", tooltip: "Most common source bucket across all visitors, first-touch attributed from UTM params or referrer at their first page view." },
    { id: "liveVisitors", label: "Live Visitors", value: s.liveVisitors, href: "/admin/traffic", tooltip: "Distinct visitors with a page view in the last 5 minutes, site-wide — excludes logged-in admin sessions." },
    { id: "uniqueVisitorsToday", label: "Unique Visitors Today", value: s.uniqueVisitorsToday, href: "/admin/traffic", tooltip: "Distinct visitors seen (page view) since midnight today — excludes admin sessions." },
    { id: "totalVisitors", label: "Total Visitors (All Time)", value: s.totalVisitors, href: "/admin/traffic", tooltip: "Every distinct visitor ever recorded, all time." },
    { id: "pageViewsToday", label: "Page Views Today", value: s.pageViewsToday, href: "/admin/traffic", tooltip: "Every page load recorded since midnight today, across all visitors." },
    { id: "totalPageViews", label: "Total Page Views", value: s.totalPageViews, href: "/admin/traffic", tooltip: "Every page load ever recorded, all time." },
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

      <p className="mt-8 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-silver-500">
        Traffic Sources
        <Link href="/admin/traffic" className="normal-case text-electric-400 hover:underline">
          View all visitors →
        </Link>
      </p>
      <GlassCard className="mt-3 p-0">
        <div className="divide-y divide-white/5">
          {(["tiktok", "youtube", "facebook", "instagram", "google", "direct", "other"] as const).map((bucket) => (
            <div key={bucket} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <span className="text-silver-300 capitalize">{bucket === "google" ? "Google / Search" : bucket}</span>
              <span className="font-semibold text-white">{s.sourceBucketCounts[bucket] ?? 0}</span>
            </div>
          ))}
          {s.totalVisitors === 0 && (
            <p className="px-5 py-8 text-center text-sm text-silver-500">
              No visitors recorded yet. This fills in as soon as a real, non-admin visit hits the site.
            </p>
          )}
        </div>
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
