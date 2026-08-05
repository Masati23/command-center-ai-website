import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import { GlassCard } from "@/components/ui";
import StatCard from "@/components/admin/StatCard";

export const dynamic = "force-dynamic";

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
    paidOrders,
    checkoutStarted,
    buyClicks,
    consultClicks,
    chatConversations,
    chatMessages,
    activeChatSessions,
    chatByLanguage,
    unansweredCount,
  ] = await Promise.all([
    db.assessment.count(),
    db.customer.count(),
    db.contactSubmission.count(),
    db.contactSubmission.count({ where: { createdAt: { gte: startOfToday } } }),
    db.contactSubmission.count({ where: { createdAt: { gte: startOfWeek } } }),
    db.contactSubmission.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.findMany({ where: { status: { in: ["PAID", "PARTIALLY_PAID"] } } }),
    db.eventLog.count({ where: { type: "checkout_started" } }),
    db.eventLog.count({ where: { type: "buy_click" } }),
    db.eventLog.count({ where: { type: "consult_click" } }),
    db.chatConversation.count(),
    db.chatMessage.count(),
    db.chatConversation.count({ where: { updatedAt: { gte: fiveMinutesAgo } } }),
    db.chatConversation.groupBy({ by: ["language"], _count: true }),
    db.chatMessage.count({ where: { flaggedUnanswered: true } }),
  ]);

  const totalRevenueCents = paidOrders.reduce((sum, o) => sum + o.amountDue, 0);
  const checkoutConversionPct = checkoutStarted > 0 ? Math.round((paidOrders.length / checkoutStarted) * 100) : 0;

  return {
    totalAssessments,
    totalCustomers,
    totalContacts,
    contactsToday,
    contactsThisWeek,
    contactsThisMonth,
    paidOrderCount: paidOrders.length,
    totalRevenueCents,
    checkoutStarted,
    buyClicks,
    consultClicks,
    checkoutConversionPct,
    chatConversations,
    chatMessages,
    activeChatSessions,
    chatByLanguage,
    unansweredCount,
  };
}

export default async function AdminOverviewPage() {
  const s = await getStats();
  const enChats = s.chatByLanguage.find((g) => g.language === "en")?._count ?? 0;
  const esChats = s.chatByLanguage.find((g) => g.language === "es")?._count ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-1.5 text-sm text-silver-500">
        Live snapshot across leads, contacts, chat, checkout, and revenue. Every number links to where it came from.
      </p>

      <GlassCard className="mt-6 border-electric-500/20 p-5">
        <p className="text-sm font-medium text-white">Visitor traffic (visitors, page views, device, referral, geo)</p>
        <p className="mt-1.5 text-xs leading-relaxed text-silver-400">
          Tracked separately by Vercel Web Analytics — enable it once in your Vercel project (Analytics tab) and
          it starts collecting immediately with no code changes here. This dashboard covers the business-specific
          activity Vercel can&rsquo;t see: leads, chat, checkout, and purchases below.
        </p>
      </GlassCard>

      <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-silver-500">Leads &amp; Contacts</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Contact Submissions"
          value={s.totalContacts}
          href="/admin/contacts"
          tooltip="Count of every row in the contact_submissions table — every Free AI Consultation form submission, all time."
        />
        <StatCard
          label="Consultation Requests"
          value={s.totalContacts}
          href="/admin/consultations"
          tooltip="Same underlying submissions as Contact Submissions — there's one public form today, so every submission is both a contact and a consultation request."
        />
        <StatCard
          label="Submitted Today"
          value={s.contactsToday}
          href="/admin/contacts"
          tooltip="Contact submissions with a created-at timestamp since midnight in the server's local time today."
        />
        <StatCard
          label="Assessment Leads"
          value={s.totalAssessments}
          href="/admin/leads"
          tooltip="Count of every row in the assessments table, regardless of whether the visitor finished it."
        />
        <StatCard
          label="This Week"
          value={s.contactsThisWeek}
          href="/admin/contacts"
          tooltip="Contact submissions since the most recent Sunday, server local time."
        />
        <StatCard
          label="This Month"
          value={s.contactsThisMonth}
          href="/admin/contacts"
          tooltip="Contact submissions since the 1st of the current calendar month, server local time."
        />
        <StatCard
          label="Customers"
          value={s.totalCustomers}
          tooltip="Distinct customer records — created the moment an assessment, checkout, or order needs one."
        />
      </div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-silver-500">Chat</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Chat Conversations"
          value={s.chatConversations}
          href="/admin/chatbot"
          tooltip="Count of every row in the chat_conversations table — one per browser session that opened the chat widget and sent a message."
        />
        <StatCard
          label="Chat Messages"
          value={s.chatMessages}
          href="/admin/chatbot"
          tooltip="Total user + assistant messages across every conversation."
        />
        <StatCard
          label="Active Now (~5 min)"
          value={s.activeChatSessions}
          tooltip="Approximation, not true real-time presence: conversations whose most recent message was within the last 5 minutes."
        />
        <StatCard
          label="Needs Review"
          value={s.unansweredCount}
          href="/admin/chatbot"
          tooltip="Assistant replies that matched an 'I'm not sure / I don't have that information' pattern — a heuristic, not a guarantee, so worth spot-checking."
        />
        <StatCard
          label="English Chats"
          value={enChats}
          tooltip="Conversations where the visitor's selected language was English at last update."
        />
        <StatCard
          label="Spanish Chats"
          value={esChats}
          tooltip="Conversations where the visitor's selected language was Spanish at last update."
        />
      </div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-silver-500">Checkout &amp; Revenue</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Buy Starter Package Clicks"
          value={s.buyClicks}
          href="/admin/service-interest"
          tooltip="Count of buy_click events logged when a visitor clicks Buy Starter Package on any service card."
        />
        <StatCard
          label="Free Consultation Clicks"
          value={s.consultClicks}
          href="/admin/service-interest"
          tooltip="Count of consult_click events logged when a visitor clicks Free Consultation / Custom Quote on any service card."
        />
        <StatCard
          label="Checkout Sessions Opened"
          value={s.checkoutStarted}
          href="/admin/orders"
          tooltip="Count of checkout_started events — every time a Stripe Checkout Session was successfully created, whether or not the visitor completed payment."
        />
        <StatCard
          label="Completed Purchases"
          value={s.paidOrderCount}
          href="/admin/orders"
          tooltip="Orders with status PAID or PARTIALLY_PAID only — failed, canceled, abandoned, and pending orders are excluded."
        />
        <StatCard
          label="Revenue"
          value={formatCents(s.totalRevenueCents)}
          href="/admin/orders"
          tooltip="Sum of amountDue across PAID/PARTIALLY_PAID orders only. Note: this Stripe account is currently in test mode, and the schema doesn't yet distinguish test-mode from live-mode payments, so this figure includes test transactions until that's added and the account switches to live."
        />
        <StatCard
          label="Checkout → Purchase Rate"
          value={`${s.checkoutConversionPct}%`}
          tooltip="Completed purchases ÷ checkout sessions opened, rounded to the nearest percent."
        />
      </div>
    </div>
  );
}
