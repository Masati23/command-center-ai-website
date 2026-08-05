"use client";

import React from "react";
import { GlassCard, Badge, Button } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * Client component so it can read the language preference (localStorage,
 * client-only) — the parent page stays a server component for the DB read
 * (order status), which server components can't avoid but client-side
 * language context can't reach.
 */
export default function CheckoutStatusContent({ confirmed }: { confirmed: boolean }) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-lg text-center">
      <Badge>{confirmed ? t("checkoutSuccess.confirmedBadge") : t("checkoutSuccess.processingBadge")}</Badge>
      <GlassCard className="mt-6 p-8">
        <h1 className="text-2xl font-semibold text-white">
          {confirmed ? t("checkoutSuccess.confirmedTitle") : t("checkoutSuccess.processingTitle")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-silver-400">
          {confirmed ? t("checkoutSuccess.confirmedBody") : t("checkoutSuccess.processingBody")}
        </p>
        <Button href="/" variant="secondary" className="mt-6">
          {t("checkoutSuccess.backHome")}
        </Button>
      </GlassCard>
    </div>
  );
}
