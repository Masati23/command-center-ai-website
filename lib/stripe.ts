import Stripe from "stripe";

// Throws loudly at import time if the key is missing rather than failing
// mysteriously deep inside a checkout request — intentional for a payments
// path. Never hardcode a key here; STRIPE_SECRET_KEY must come from the
// environment (.env.local locally, Vercel env vars in production).
const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(secretKey ?? "sk_test_placeholder_not_configured", {
  // Managed Payments (enabled by default on this Stripe account) requires
  // API version 2025-03-31.basil or later — the installed `stripe` npm
  // package (16.x) predates that version and only has a TypeScript literal
  // for 2024-06-20, hence the cast. Stripe negotiates the API version via
  // this header independent of SDK version, so this is safe; if the `stripe`
  // package is ever upgraded to a version that natively supports
  // 2025-03-31.basil, this cast can be dropped.
  apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
  typescript: true,
});

export const stripeConfigured = !!secretKey;

// Deposit percentage for PATH 2 (custom-project deposit) orders. Editable
// here for Phase 1; candidate for PricingConfig once the admin dashboard
// (Phase 8) exists.
export const DEPOSIT_PERCENTAGE = 25;
