import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, GlassCard, Badge, Button } from "@/components/ui";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Intentionally does NOT claim the payment is confirmed. Order status is
 * only ever flipped by the Stripe webhook (app/api/webhooks/stripe/route.ts)
 * — this page reads whatever the current DB status is and reflects it
 * honestly, including "still processing" if the webhook hasn't landed yet.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order_id?: string };
}) {
  const order = searchParams.order_id
    ? await db.order.findUnique({ where: { id: searchParams.order_id } })
    : null;

  const confirmed = order?.status === "PAID" || order?.status === "PARTIALLY_PAID";

  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-lg text-center">
            <Badge>{confirmed ? "Payment Received" : "Processing"}</Badge>
            <GlassCard className="mt-6 p-8">
              <h1 className="text-2xl font-semibold text-white">
                {confirmed ? "Thank you — you're all set." : "Confirming your payment…"}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                {confirmed
                  ? "Your payment has been confirmed and your onboarding checklist has been created. We'll be in touch shortly with next steps."
                  : "Stripe is finalizing your payment confirmation — this usually takes just a few seconds. Refresh this page in a moment, or check your email for a receipt."}
              </p>
              <Button href="/" variant="secondary" className="mt-6">
                Back to Home
              </Button>
            </GlassCard>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
