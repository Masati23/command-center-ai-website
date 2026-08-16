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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: product.basePrice,
            product_data: {
              name: `${product.name} — Starter Package`,
              description: product.description,
              // Required now that Managed Payments is enabled on this
              // account — Stripe rejects line items with no product tax
              // code. txcd_10000000 (General - Electronically Supplied
              // Services) is Stripe's own documented default for
              // not-yet-classified digital services. Stripe's docs note
              // this default doesn't capture state-specific US nuances as
              // precisely as a fully-classified code would — fine for test
              // mode, but pick a more specific code via the Stripe
              // Dashboard's Product Tax Code selector before going live.
              tax_code: "txcd_10000000",
            },
          },
          quantity: 1,
        },
      ],
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: {
        productSlug: product.slug,
        source: "direct_purchase",
      },
    });

    const attribution = await buildCheckoutAttribution(req);

    await db.eventLog.create({
      data: {
        type: "checkout_started",
        refId: session.id,
        metadata: {
          source: "direct_purchase",
          productSlug: product.slug,
          amount: product.basePrice,
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
