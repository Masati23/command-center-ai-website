import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

type Status = "healthy" | "warning" | "error";

function StatusPill({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    healthy: "bg-green-500/15 text-green-300",
    warning: "bg-amber-500/15 text-amber-300",
    error: "bg-red-500/15 text-red-300",
  };
  const label: Record<Status, string> = { healthy: "Healthy", warning: "Warning", error: "Error" };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>{label[status]}</span>;
}

function Row({ label, status, detail }: { label: string; status: Status; detail: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="mt-0.5 text-xs text-silver-500">{detail}</p>
      </div>
      <StatusPill status={status} />
    </div>
  );
}

export default async function AdminSystemHealthPage() {
  let dbStatus: Status = "healthy";
  let dbDetail = "Connected — queries are succeeding.";
  try {
    await db.eventLog.count();
  } catch {
    dbStatus = "error";
    dbDetail = "A query just failed — check DATABASE_URL and that migrations have been applied.";
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [stalePendingOrders, recentFailedOrders, recentFailedPayments, recentUnanswered, recentContactSubmissions, recentChatMessages] =
    await Promise.all([
      db.order.count({ where: { status: "PENDING", createdAt: { lt: oneHourAgo } } }),
      db.order.count({ where: { status: "FAILED", createdAt: { gte: oneDayAgo } } }),
      db.payment.count({ where: { status: "FAILED", createdAt: { gte: oneDayAgo } } }),
      db.chatMessage.count({ where: { flaggedUnanswered: true, createdAt: { gte: oneDayAgo } } }),
      db.contactSubmission.count({ where: { createdAt: { gte: oneDayAgo } } }),
      db.chatMessage.count({ where: { createdAt: { gte: oneDayAgo } } }),
    ]);

  const envVars: { name: string; present: boolean; required: boolean }[] = [
    { name: "DATABASE_URL", present: !!process.env.DATABASE_URL, required: true },
    { name: "STRIPE_SECRET_KEY", present: !!process.env.STRIPE_SECRET_KEY, required: true },
    { name: "STRIPE_WEBHOOK_SECRET", present: !!process.env.STRIPE_WEBHOOK_SECRET, required: true },
    { name: "NEXT_PUBLIC_APP_URL", present: !!process.env.NEXT_PUBLIC_APP_URL, required: true },
    { name: "RESEND_API_KEY", present: !!process.env.RESEND_API_KEY, required: true },
    { name: "OPENAI_API_KEY", present: !!process.env.OPENAI_API_KEY, required: true },
    { name: "AUTH_SECRET", present: !!process.env.AUTH_SECRET, required: true },
    { name: "CONTACT_NOTIFY_EMAIL", present: !!process.env.CONTACT_NOTIFY_EMAIL, required: false },
    { name: "CRM_WEBHOOK_URL", present: !!process.env.CRM_WEBHOOK_URL, required: false },
    { name: "CRON_SECRET", present: !!process.env.CRON_SECRET, required: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">System Health</h1>
      <p className="mt-1.5 text-sm text-silver-500">Configuration presence and activity-based health signals. No secret values are ever shown here.</p>

      <GlassCard className="mt-6 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Core Services</p>
        <div className="mt-2">
          <Row label="Database Connection" status={dbStatus} detail={dbDetail} />
          <Row
            label="Stripe Configuration"
            status={process.env.STRIPE_SECRET_KEY ? "healthy" : "error"}
            detail={process.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY is set." : "STRIPE_SECRET_KEY is missing — checkout will not work."}
          />
          <Row
            label="Stripe Webhook Processing"
            status={!process.env.STRIPE_WEBHOOK_SECRET ? "error" : stalePendingOrders > 0 ? "warning" : "healthy"}
            detail={
              !process.env.STRIPE_WEBHOOK_SECRET
                ? "STRIPE_WEBHOOK_SECRET is missing — payments won't be recorded even if the card is charged."
                : stalePendingOrders > 0
                  ? `${stalePendingOrders} order(s) have been stuck in PENDING for over an hour — the webhook may not be reaching this project.`
                  : "Configured, and no orders are stuck pending."
            }
          />
          <Row
            label="Email Delivery Configuration"
            status={process.env.RESEND_API_KEY ? "healthy" : "error"}
            detail={process.env.RESEND_API_KEY ? "RESEND_API_KEY is set." : "RESEND_API_KEY is missing — no emails are being sent (contact notifications, order confirmations, or otherwise)."}
          />
          <Row
            label="Chatbot"
            status={process.env.OPENAI_API_KEY ? "healthy" : "error"}
            detail={
              process.env.OPENAI_API_KEY
                ? `Configured. ${recentChatMessages} message(s) in the last 24 hours.`
                : "OPENAI_API_KEY is missing — the chat widget returns a clear 'not configured' message instead of responding."
            }
          />
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Form &amp; Logging Activity (last 24h)</p>
        <div className="mt-2">
          <Row
            label="Contact / Consultation Form Processing"
            status="healthy"
            detail={`${recentContactSubmissions} submission(s) saved to the database in the last 24 hours. Database writes don't depend on RESEND_API_KEY — see Email Delivery above for whether notifications went out.`}
          />
          <Row
            label="Chatbot Logging"
            status="healthy"
            detail="Every chat message is persisted to the database at write time — logging itself has no separate failure mode from the write succeeding."
          />
          <Row
            label="Analytics Tracking"
            status="healthy"
            detail="Buy/Consult click events write to the same EventLog table used everywhere else — see Service Interest for the numbers."
          />
          <Row
            label="Recent Failed Orders"
            status={recentFailedOrders > 0 ? "warning" : "healthy"}
            detail={`${recentFailedOrders} order(s) marked FAILED in the last 24 hours.`}
          />
          <Row
            label="Recent Failed Payments"
            status={recentFailedPayments > 0 ? "warning" : "healthy"}
            detail={`${recentFailedPayments} payment(s) marked FAILED in the last 24 hours.`}
          />
          <Row
            label="Chatbot Needs-Review Flags"
            status={recentUnanswered > 5 ? "warning" : "healthy"}
            detail={`${recentUnanswered} response(s) flagged as uncertain in the last 24 hours.`}
          />
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-silver-500">Environment Variables (presence only)</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {envVars.map((v) => (
            <div key={v.name} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
              <span className="font-mono text-xs text-silver-300">{v.name}</span>
              <StatusPill status={v.present ? "healthy" : v.required ? "error" : "warning"} />
            </div>
          ))}
        </div>
      </GlassCard>

      <p className="mt-4 text-xs leading-relaxed text-silver-500">
        What this page can&rsquo;t see: individual failed HTTP requests or failed email send attempts — those are
        only logged to Vercel&rsquo;s own Function Logs (Vercel dashboard → Logs), not to this database. The rows
        above use the closest honest proxy available from data this app actually stores.
      </p>
    </div>
  );
}
