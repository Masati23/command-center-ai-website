"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

type PlanType = "FULL" | "DEPOSIT" | "MONTHLY";

const planCopyKeys: Record<PlanType, { labelKey: TranslationKey; descriptionKey: TranslationKey }> = {
  FULL: { labelKey: "checkout.plan.full.label", descriptionKey: "checkout.plan.full.description" },
  DEPOSIT: { labelKey: "checkout.plan.deposit.label", descriptionKey: "checkout.plan.deposit.description" },
  MONTHLY: { labelKey: "checkout.plan.monthly.label", descriptionKey: "checkout.plan.monthly.description" },
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
  const { t } = useLanguage();

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
        throw new Error(data.error || t("checkout.errorGeneric"));
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || t("checkout.errorGeneric"));
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
              <p className="font-semibold">{t(planCopyKeys[plan].labelKey)}</p>
              <p className="mt-1 text-silver-500">{t(planCopyKeys[plan].descriptionKey)}</p>
            </button>
          ))}
        </div>
      )}

      <Button variant="primary" className="mt-5 w-full" onClick={startCheckout}>
        {loading ? t("checkout.redirecting") : t("checkout.proceedButton")}
      </Button>

      {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}

      <p className="mt-3 text-center text-[11px] text-silver-500">{t("checkout.disclaimer")}</p>
    </div>
  );
}
