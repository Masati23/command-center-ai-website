import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { buildCheckoutAttribution } from "@/lib/checkout-attribution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  productSlug: z.string().min(1),
  // Client only sends a boolean — never a price. The server is the sole
  // source of truth for both the one-time basePrice and the recurring
  // monthlySupport amount, both read fresh from the Product row below.
  includeMonthlySupport: z.boolean().optional().default(false),
});

/**
 * "Buy Starter Package" — a one-click purchase path for the fixed-price
 * starter package of a single Product, independent of the AI Business
 * Assessment / Proposal flow (app/api/checkout/session/route.ts). No
 * Customer or Order record exists yet when this runs; Stripe Checkout
 * itself collects the buyer's name/email/phone on its hosted page
 * (customer_creation + phone_number_collection below), and the webhook
 * (app/api/webhooks/stripe/route.ts) creates the Customer + Order +
 * OrderItem the moment payment is confirmed — never before, and never from
 * a client-trusted redirect.
 *
 * Always uses whatever STRIPE_SECRET_KEY is configured in this project's
 * own environment — the Command Center AI account. Nothing here reads from
 * or writes to the separate Command Center AI Academy Stripe account.
 */
export async function POST(req: NextRequest) {
  if (!stripeConfigured) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Set STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 }
    );
  }

  if (isRateLimited(getClientIp(req), 15, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const product = await db.product.findUnique({ where: { slug: parsed.data.productSlug } });
  if (!product || product.status !== "ACTIVE") {
    return NextResponse.json({ error: "Product not found or not available for purchase." }, { status: 404 });
  }

  const wantsSupport = parsed.data.includeMonthlySupport;

  if (wantsSupport && (product.monthlySupport == null || product.monthlySupport <= 0)) {
    return NextResponse.json(
      { error: "This service does not have a monthly support option." },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const source = wantsSupport ? "direct_purchase_with_support" : "direct_purchase";

  // The one-time setup line item is identical in both paths — same
  // product_data name/description/tax_code as the original one-time-only
  // flow. When support is included, mode switches to "subscription" and a
  // SECOND line item is added for the recurring price. Critically, the
  // recurring `price_data.unit_amount` below is `product.monthlySupport`
  // ONLY — the setup fee is never folded into it. Stripe treats a
  // subscription-mode line item with no `recurring` block as a one-time
  // invoice item that bills once, on the subscription's first invoice, and
  // never again; the Subscription object's own recurring Price is only the
  // monthlySupport line. Future renewal invoices (billing_reason:
  // "subscription_cycle") therefore only ever charge product.monthlySupport
  // — the one-time setup fee cannot recur through this path.
  const setupLineItem = {
    price_data: {
      currency: "usd" as const,
      unit_amount: product.basePrice,
      product_data: {
        name: `${product.name} — Starter Package (one-time setup)`,
        description: product.description,
        // Required now that Managed Payments is enabled on this account —
        // Stripe rejects line items with no product tax code.
        // txcd_10000000 (General - Electronically Supplied Services) is
        // Stripe's own documented default for not-yet-classified digital
        // services.
        tax_code: "txcd_10000000",
      },
    },
    quantity: 1,
  };

  const supportLineItem = {
    price_data: {
      currency: "usd" as const,
      unit_amount: product.monthlySupport ?? 0,
      recurring: { interval: "month" as const },
      product_data: {
        name: `${product.name} — Monthly Support (recurring)`,
        description: "Ongoing monitoring, updates, and support for this AI system. Billed monthly.",
        tax_code: "txcd_10000000",
      },
    },
    quantity: 1,
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: wantsSupport ? "subscription" : "payment",
      line_items: wantsSupport ? [supportLineItem, setupLineItem] : [setupLineItem],
      // customer_creation and phone_number_collection are payment-mode-only
      // params — Stripe always creates/reuses a Customer automatically for
      // subscription-mode sessions and rejects these params on those.
      ...(wantsSupport
        ? {}
        : { customer_creation: "always" as const, phone_number_collection: { enabled: true } }),
      billing_address_collection: "auto",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: {
        productSlug: product.slug,
        source,
        includesMonthlySupport: wantsSupport ? "true" : "false",
        monthlySupportAmount: wantsSupport ? String(product.monthlySupport) : "",
        setupAmount: String(product.basePrice),
      },
    });

    const attribution = await buildCheckoutAttribution(req);

    await db.eventLog.create({
      data: {
        type: "checkout_started",
        refId: session.id,
        metadata: {
          source,
          productSlug: product.slug,
          setupAmount: product.basePrice,
          includesMonthlySupport: wantsSupport,
          monthlySupportAmount: wantsSupport ? product.monthlySupport : null,
          ...attribution,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Direct-purchase Stripe Checkout Session creation failed:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
