"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, GlassCard, Badge, Button } from "@/components/ui";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CheckoutCancelPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-lg text-center">
            <Badge>{t("checkoutCancel.badge")}</Badge>
            <GlassCard className="mt-6 p-8">
              <h1 className="text-2xl font-semibold text-white">{t("checkoutCancel.title")}</h1>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">{t("checkoutCancel.body")}</p>
              <Button href="/" variant="secondary" className="mt-6">
                {t("checkoutSuccess.backHome")}
              </Button>
            </GlassCard>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
