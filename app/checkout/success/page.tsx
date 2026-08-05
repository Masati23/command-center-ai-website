import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section } from "@/components/ui";
import { db } from "@/lib/db";
import CheckoutStatusContent from "@/components/checkout/CheckoutStatusContent";

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
  searchParams: { order_id?: string; session_id?: string };
}) {
  // order_id covers the proposal-flow checkout (app/api/checkout/session),
  // which creates the Order before redirecting to Stripe. Direct "Buy
  // Starter Package" purchases (app/api/checkout/direct-purchase) don't
  // have an Order yet at redirect time — the webhook creates it only after
  // payment is confirmed — so those redirects carry session_id instead,
  // looked up against the Order the webhook stamps with that same session
  // id. Either param, or neither yet having landed, is handled honestly
  // below: no order found just means "still processing."
  const order = searchParams.order_id
    ? await db.order.findUnique({ where: { id: searchParams.order_id } })
    : searchParams.session_id
      ? await db.order.findFirst({ where: { stripeCheckoutSessionId: searchParams.session_id } })
      : null;

  const confirmed = order?.status === "PAID" || order?.status === "PARTIALLY_PAID";

  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <CheckoutStatusContent confirmed={confirmed} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
