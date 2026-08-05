import AdminShell from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// A route group (parens don't affect the URL) so /admin/login stays outside
// this shell — the login page shouldn't show a nav for pages you can't
// reach yet. Everything else under /admin gets the shared header/nav here,
// and the actual access control happens in middleware.ts, not this layout.
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  let badges;

  if (session) {
    const admin = await db.adminUser.findUnique({ where: { id: session.adminId } });
    // Never-visited-before default: last 24 hours, so a brand-new admin
    // account doesn't show every record that ever existed as "new."
    const since = admin?.lastSeenAt ?? new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [newLeads, newPurchases, failedPayments, newChatConversations] = await Promise.all([
      db.contactSubmission.count({ where: { createdAt: { gt: since } } }),
      db.order.count({ where: { status: { in: ["PAID", "PARTIALLY_PAID"] }, createdAt: { gt: since } } }),
      db.payment.count({ where: { status: "FAILED", createdAt: { gt: since } } }),
      db.chatConversation.count({ where: { startedAt: { gt: since } } }),
    ]);

    badges = { newLeads, newPurchases, failedPayments, newChatConversations };
  }

  return <AdminShell badges={badges}>{children}</AdminShell>;
}
