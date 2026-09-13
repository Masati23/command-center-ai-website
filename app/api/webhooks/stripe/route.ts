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
      case "checkout.session.expired":
        await handleCheckoutExpired(event);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
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

  if (
    session.metadata?.source === "direct_purchase" ||
    session.metadata?.source === "direct_purchase_with_support"
  ) {
    await handleDirectPurchaseCompleted(event, session);
    return;
  }

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
      data: {
        type: "payment_succeeded",
        refId: order.id,
        email: order.customer.email,
        metadata: { stripeEventId: event.id, newStatus },
      },
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

/**
 * Direct "Buy Starter Package" purchases (app/api/checkout/direct-purchase)
 * never created a Customer or Order before redirecting to Stripe — unlike
 * the proposal flow, there's no assessment that already collected the
 * buyer's info. Stripe Checkout itself collected name/email/phone on its
 * hosted page, so this is the first and only place those records get
 * created, and only after Stripe has confirmed the payment.
 *
 * Handles both plain one-time purchases (source: "direct_purchase") and the
 * bundled setup + monthly support path (source:
 * "direct_purchase_with_support"). The bundled path always charges the
 * one-time setup fee once; if support was selected, the SAME Checkout
 * Session also starts a recurring subscription whose only recurring Price
 * is the monthlySupport amount (never the setup fee — see
 * app/api/checkout/direct-purchase/route.ts for how the line items are
 * built). For the bundled path this creates the Customer + Order (with
 * stripeSubscriptionId set) but deliberately does NOT create a Payment row
 * here. The existing proposal-flow MONTHLY pattern creates a Payment on
 * checkout.completed AND lets invoice.payment_succeeded create another one
 * for that same first invoice (different stripeEventId, so the idempotency
 * constraint doesn't catch it) — a pre-existing double-count risk. This
 * handler avoids replicating that: handleInvoicePaymentSucceeded already
 * does a generic `stripeSubscriptionId` lookup and will create the one true
 * Payment row (and send the one true confirmation email, with a real
 * receiptUrl) once Stripe fires that event moments later — no changes
 * needed there. That first invoice's amount_paid will equal setup +
 * first month's support combined (Stripe bills the one-time item on the
 * subscription's first invoice); every subsequent invoice
 * (billing_reason: "subscription_cycle") is monthlySupport only.
 */
async function handleDirectPurchaseCompleted(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const productSlug = session.metadata?.productSlug;
  if (!productSlug) return;

  const withSupport = session.metadata?.source === "direct_purchase_with_support";

  const product = await db.product.findUnique({ where: { slug: productSlug } });
  if (!product) return;

  const details = session.customer_details;
  const email = details?.email ?? session.customer_email;
  if (!email) {
    console.error(`Direct-purchase session ${session.id} completed with no customer email — cannot record order.`);
    return;
  }
  const name = details?.name ?? email;
  const phone = details?.phone ?? undefined;

  const customer = await db.customer.upsert({
    where: { email },
    update: { name, phone: phone ?? undefined },
    create: { name, email, phone },
  });

  const amountPaid = session.amount_total ?? product.basePrice;

  if (withSupport) {
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : undefined;
    // amountTotal reflects the full ongoing commitment communicated to the
    // customer (setup + one month of support), not just what was charged
    // today, matching the Order schema's "full project value" convention
    // used elsewhere. amountDue is what Stripe actually charged today.
    const amountTotal = product.basePrice + (product.monthlySupport ?? 0);

    const order = await db.order.create({
      data: {
        customerId: customer.id,
        proposalId: null,
        path: "direct_purchase_with_support",
        paymentPlanType: "MONTHLY",
        amountTotal,
        amountDue: amountPaid,
        status: "PAID",
        stripeCheckoutSessionId: session.id,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        stripeSubscriptionId: subscriptionId,
        items: { create: [{ productId: product.id, price: product.basePrice }] },
      },
    });

    await db.eventLog.create({
      data: {
        type: "payment_succeeded",
        refId: order.id,
        email: customer.email,
        metadata: {
          stripeEventId: event.id,
          source: "direct_purchase_with_support",
          productSlug: product.slug,
          setupAmount: product.basePrice,
          monthlySupportAmount: product.monthlySupport,
          stripeSubscriptionId: subscriptionId ?? null,
          note: "Order created on checkout.session.completed; first Payment row + confirmation email is created by invoice.payment_succeeded to avoid double-booking. First invoice amount = setup + first month combined; every invoice after that is monthlySupport only.",
        },
      },
    });

    // No Payment row and no confirmation email here on purpose — see
    // function-level comment. invoice.payment_succeeded (fired moments
    // later by Stripe for the subscription's first invoice) handles both.
    return;
  }

  const order = await db.order.create({
    data: {
      customerId: customer.id,
      proposalId: null,
      path: "direct_purchase",
      paymentPlanType: "FULL",
      amountTotal: product.basePrice,
      amountDue: amountPaid,
      status: "PAID",
      stripeCheckoutSessionId: session.id,
      stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
      items: { create: [{ productId: product.id, price: product.basePrice }] },
    },
  });

  await db.payment.create({
    data: {
      orderId: order.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : `session_${session.id}`,
      stripeEventId: event.id, // idempotency key — duplicate deliveries hit this unique constraint
      amount: amountPaid,
      status: "SUCCEEDED",
      receiptUrl: null,
    },
  });

  await db.eventLog.create({
    data: {
      type: "payment_succeeded",
      refId: order.id,
      email: customer.email,
      metadata: { stripeEventId: event.id, source: "direct_purchase", productSlug: product.slug },
    },
  });

  await sendOrderConfirmationEmails({
    orderId: order.id,
    customerName: customer.name,
    customerEmail: customer.email,
    businessName: customer.businessName ?? undefined,
    amountPaidCents: amountPaid,
    amountTotalCents: product.basePrice,
    status: "PAID",
    paymentPlanType: "FULL",
  });

  // Priority 3 (purchase SMS + email alerts to the owner) hooks in here next.
}

/**
 * checkout.session.expired fires ~24h after a Checkout Session is created
 * if the buyer never completes payment (Stripe's own default expiry window
 * for one-time "payment" mode sessions — not something this app controls
 * or can shorten/lengthen without a Stripe dashboard/API setting change).
 * This is purely additive visibility: it records that a started checkout
 * ended without payment, using only fields Stripe actually provides on the
 * event. It never mutates Order/Payment state — a customer could still be
 * mid-checkout on a *different*, newer session for the same product, and
 * marking anything FAILED here could contradict that. Existing checkout
 * and payment-success behavior is completely unchanged.
 */
async function handleCheckoutExpired(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  const sourceMeta = session.metadata?.source;
  const isDirectPurchase = sourceMeta === "direct_purchase" || sourceMeta === "direct_purchase_with_support";
  const productSlug = session.metadata?.productSlug ?? null;
  const orderId = session.metadata?.orderId ?? null;
  const refId = isDirectPurchase ? session.id : orderId ?? session.id;

  await db.eventLog.create({
    data: {
      type: "checkout_expired",
      refId,
      metadata: {
        stripeEventId: event.id,
        stripeSessionId: session.id,
        source: isDirectPurchase ? sourceMeta : "proposal",
        productSlug,
        amountTotal: session.amount_total,
        currency: session.currency,
      },
    },
  });
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
    data: {
      type: "payment_succeeded",
      refId: order.id,
      email: order.customer.email,
      metadata: { stripeEventId: event.id, recurring: true },
    },
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

/**
 * Fires when a recurring monthly support subscription ends — the customer
 * cancelled, or (after retries are exhausted) a card kept failing. This is
 * intentionally additive-only, same posture as handleCheckoutExpired: it
 * records the cancellation in EventLog for the admin dashboard, but does
 * NOT change Order.status. The one-time setup work this Order represents
 * was already delivered and paid for; the OrderStatus enum (PENDING / PAID
 * / PARTIALLY_PAID / FAILED / CANCELLED) has no state that means "setup
 * complete, support subscription separately ended," and guessing at
 * overloading one of those would misrepresent the order. Whether ongoing
 * support is active going forward should be read from Stripe (via
 * stripeSubscriptionId) or a dedicated field added later — not invented
 * here.
 */
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  const order = await db.order.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { customer: true },
  });
  if (!order) return;

  await db.eventLog.create({
    data: {
      type: "subscription_cancelled",
      refId: order.id,
      email: order.customer.email,
      metadata: {
        stripeEventId: event.id,
        stripeSubscriptionId: subscription.id,
        cancelReason: subscription.cancellation_details?.reason ?? null,
        endedAt: subscription.ended_at ?? null,
      },
    },
  });
}
