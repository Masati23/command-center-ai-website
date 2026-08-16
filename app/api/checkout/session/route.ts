import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { stripe, stripeConfigured, DEPOSIT_PERCENTAGE } from "@/lib/stripe";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { buildCheckoutAttribution } from "@/lib/checkout-attribution";

export const runtime = "nodejs";

const bodySchema = z.object({
  proposalId: z.string(),
  paymentPlanType: z.enum(["FULL", "DEPOSIT", "MONTHLY"]),
});

/**
 * Creates a Stripe-hosted Checkout Session for a proposal. Command Center AI
 * never collects card details directly — Stripe Checkout handles that
 * entirely, including Apple Pay / Google Pay / ACH, which Stripe surfaces
 * automatically for eligible payment method types rather than needing
 * separate integration code per method.
 */
export async function POST(req: NextRequest) {
  if (!stripeConfigured) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Set STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 }
    );
  }

  if (isRateLimited(getClientIp(req), 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const { proposalId, paymentPlanType } = parsed.data;

  const proposal = await db.proposal.findUnique({
    where: { id: proposalId },
    include: { customer: true },
  });
  if (!proposal || !proposal.customer) {
    return NextResponse.json({ error: "Proposal or customer not found" }, { status: 404 });
  }

  const pricing = proposal.pricingSnapshot as any;
  const amountTotal: number = pricing.finalEstimateCents;
  const amountDue =
    paymentPlanType === "DEPOSIT" ? Math.round((amountTotal * DEPOSIT_PERCENTAGE) / 100) : amountTotal;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const order = await db.order.create({
    data: {
      customerId: proposal.customer.id,
      proposalId: proposal.id,
      path: proposal.path,
      paymentPlanType,
      amountTotal,
      amountDue,
      status: "PENDING",
    },
  });

  const productName =
    paymentPlanType === "DEPOSIT"
      ? `Command Center AI — Project Deposit (${DEPOSIT_PERCENTAGE}% of estimated project, credited toward final price)`
      : "Command Center AI — AI Workforce Build";

  try {
    const session =
      paymentPlanType === "MONTHLY"
        ? await stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: proposal.customer.email,
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  recurring: { interval: "month" },
                  unit_amount: amountDue,
                  // txcd_10000000 = Stripe's default tax code for
                  // not-yet-classified digital services, required now that
                  // Managed Payments is enabled. Revisit via the Stripe
                  // Dashboard's Product Tax Code selector before live
                  // payments (see same note in direct-purchase/route.ts).
                  product_data: { name: `${productName} — Monthly Plan`, tax_code: "txcd_10000000" },
                },
                quantity: 1,
              },
            ],
            success_url: `${appUrl}/checkout/success?order_id=${order.id}`,
            cancel_url: `${appUrl}/checkout/cancel?order_id=${order.id}`,
            metadata: { orderId: order.id },
          })
        : await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: proposal.customer.email,
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  unit_amount: amountDue,
                  product_data: { name: productName, tax_code: "txcd_10000000" },
                },
                quantity: 1,
              },
            ],
            success_url: `${appUrl}/checkout/success?order_id=${order.id}`,
            cancel_url: `${appUrl}/checkout/cancel?order_id=${order.id}`,
            metadata: { orderId: order.id },
          });

    await db.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    const attribution = await buildCheckoutAttribution(req);

    await db.eventLog.create({
      data: {
        type: "checkout_started",
        refId: order.id,
        email: proposal.customer.email,
        metadata: { paymentPlanType, amountDue, ...attribution },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Session creation failed:", err);
    await db.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
