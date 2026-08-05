"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";

type PlanType = "FULL" | "DEPOSIT" | "MONTHLY";

const planCopy: Record<PlanType, { label: string; description: string }> = {
  FULL: { label: "Pay in Full", description: "One payment, nothing else due at setup." },
  DEPOSIT: { label: "Deposit + Balance", description: "25% now to reserve your build slot, credited toward your final price. Remaining balance is invoiced once scope is confirmed." },
  MONTHLY: { label: "Monthly Plan", description: "Spread the setup cost across a monthly payment plan." },
};

/**
 * The actual checkout trigger — calls /api/checkout/session and redirects
 * to Stripe-hosted Checkout. This was missing from the results page CTA,
 * which only scrolled to an on-page anchor; that's now fixed here.
 */
export default function CheckoutOptions({
  proposalId,
  availablePlans = ["FULL", "DEPOSIT", "MONTHLY"],
}: {
  proposalId: string;
  availablePlans?: PlanType[];
}) {
  const [selected, setSelected] = useState<PlanType>(availablePlans[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, paymentPlanType: selected }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      {availablePlans.length > 1 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {availablePlans.map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setSelected(plan)}
              className={`rounded-xl border px-4 py-3 text-left text-xs transition-colors ${
                selected === plan
                  ? "border-electric-500/60 bg-electric-500/10 text-white"
                  : "border-white/10 bg-white/[0.02] text-silver-300 hover:border-white/20"
              }`}
            >
              <p className="font-semibold">{planCopy[plan].label}</p>
              <p className="mt-1 text-silver-500">{planCopy[plan].description}</p>
            </button>
          ))}
        </div>
      )}

      <Button variant="primary" className="mt-5 w-full" onClick={startCheckout}>
        {loading ? "Redirecting to secure checkout…" : "Proceed to Secure Checkout"}
      </Button>

      {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}

      <p className="mt-3 text-center text-[11px] text-silver-500">
        Payment is handled entirely by Stripe's secure, hosted checkout. Command Center AI never sees or stores
        your card details.
      </p>
    </div>
  );
}
