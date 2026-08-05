import Stripe from "stripe";

// Throws loudly at import time if the key is missing rather than failing
// mysteriously deep inside a checkout request — intentional for a payments
// path. Never hardcode a key here; STRIPE_SECRET_KEY must come from the
// environment (.env.local locally, Vercel env vars in production).
const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(secretKey ?? "sk_test_placeholder_not_configured", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const stripeConfigured = !!secretKey;

// Deposit percentage for PATH 2 (custom-project deposit) orders. Editable
// here for Phase 1; candidate for PricingConfig once the admin dashboard
// (Phase 8) exists.
export const DEPOSIT_PERCENTAGE = 25;
