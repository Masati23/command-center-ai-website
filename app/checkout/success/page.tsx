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
          <CheckoutStatusContent confirmed={confirmed} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
