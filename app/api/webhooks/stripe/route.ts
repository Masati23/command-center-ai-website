import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmails } from "@/lib/notifications";

export const runtime = "nodejs";

const ONBOARDING_TASKS: { taskName: string; assetType: string }[] = [
  { taskName: "Provide your logo", assetType: "logo" },
  { taskName: "Share your brand colors", assetType: "brand_colors" },
  { taskName: "Grant website access", assetType: "website_access" },
  { taskName: "Grant domain access", assetType: "domain_access" },
  { taskName: "Confirm business hours", assetType: "business_hours" },
  { taskName: "List your services", assetType: "services" },
  { taskName: "Provide FAQs", assetType: "faqs" },
  { taskName: "Grant calendar access", assetType: "calendar_access" },
  { taskName: "Grant CRM access", assetType: "crm_access" },
  { taskName: "Share relevant API keys", assetType: "api_keys" },
];

/**
 * Stripe webhook — the ONLY place an order is ever marked paid. The
 * /checkout/success page never flips payment status on its own; it just
 * shows a "processing" state until this handler has run. This satisfies the
 * explicit requirement not to trust the success-page redirect.
 *
 * Idempotency: Payment.stripeEventId has a unique DB constraint. If the same
 * Stripe event is delivered twice (which Stripe's own docs say to expect),
 * the second insert hits that constraint and is treated as already-handled.
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event);
        break;
      default:
        // Unhandled event types are fine to ignore — Stripe sends far more
        // event types than this app needs to act on.
        break;
    }
  } catch (err) {
    console.error(`Error handling Stripe webhook event ${event.type}:`, err);
    // Still return 200 for idempotency-constraint "already processed" cases;
    // any other error returns 500 so Stripe retries delivery.
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function isUniqueConstraintError(err: unknown): boolean {
  return !!err && typeof err === "object" && (err as any).code === "P2002";
}

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  const order = await db.order.findUnique({ where: { id: orderId }, include: { customer: true } });
  if (!order) return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : `session_${session.id}`; // subscription-mode sessions don't have a payment_intent; the first invoice event covers that charge instead

  const newStatus = order.amountDue >= order.amountTotal ? "PAID" : "PARTIALLY_PAID";

  await db.$transaction([
    db.payment.create({
      data: {
        orderId: order.id,
        stripePaymentIntentId: paymentIntentId,
        stripeEventId: event.id, // idempotency key
        amount: session.amount_total ?? order.amountDue,
        status: "SUCCEEDED",
        receiptUrl: null,
      },
    }),
    db.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined,
      },
    }),
    db.onboardingTask.createMany({
      data: ONBOARDING_TASKS.map((t) => ({ orderId: order.id, taskName: t.taskName, assetType: t.assetType })),
    }),
    db.eventLog.create({
      data: { type: "payment_succeeded", refId: order.id, metadata: { stripeEventId: event.id, newStatus } },
    }),
  ]);

  await sendOrderConfirmationEmails({
    orderId: order.id,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    businessName: order.customer.businessName ?? undefined,
    amountPaidCents: session.amount_total ?? order.amountDue,
    amountTotalCents: order.amountTotal,
    status: newStatus,
    paymentPlanType: order.paymentPlanType,
  });

  // TODO(next iteration): internal project creation — a lightweight
  // Project record linked to this order, for the owner dashboard (Priority
  // 6) to surface build progress against. Deferred to that phase since it
  // needs the dashboard's data shape decided first.
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : undefined;
  if (!subscriptionId) return;

  const order = await db.order.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    include: { customer: true },
  });
  if (!order) return;

  await db.payment.create({
    data: {
      orderId: order.id,
      stripePaymentIntentId: `invoice_${invoice.id}`,
      stripeEventId: event.id,
      amount: invoice.amount_paid,
      status: "SUCCEEDED",
      receiptUrl: invoice.hosted_invoice_url ?? null,
    },
  });

  await db.eventLog.create({
    data: { type: "payment_succeeded", refId: order.id, metadata: { stripeEventId: event.id, recurring: true } },
  });

  await sendOrderConfirmationEmails({
    orderId: order.id,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    businessName: order.customer.businessName ?? undefined,
    amountPaidCents: invoice.amount_paid,
    amountTotalCents: order.amountTotal,
    status: "PAID",
    paymentPlanType: order.paymentPlanType,
    receiptUrl: invoice.hosted_invoice_url,
  });
}
