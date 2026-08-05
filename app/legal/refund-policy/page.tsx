import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-3xl">
            <Badge>Legal</Badge>
            <h1 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Refund Policy</h1>
            <p className="mt-3 text-sm text-silver-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

            <div className="mt-10 space-y-8 text-sm leading-relaxed text-silver-400">
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Standard purchases (Pay in Full)</h2>
                <p>
                  If work has not yet started on your project, you may request a full refund within 3 days of
                  purchase. Once development work has begun, refunds are prorated based on work completed, at our
                  discretion.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Project deposits</h2>
                <p>
                  A deposit reserves your build slot and covers initial scoping work. Deposits are credited in full
                  toward your final project price once scope is confirmed. If you decide not to proceed after the
                  scoping consultation and before development work begins, your deposit is refundable, less any
                  scoping work already completed. Once development work begins, the deposit is non-refundable.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Monthly payment plans</h2>
                <p>
                  Monthly plan payments already processed are non-refundable once the corresponding month's work has
                  been delivered. You may cancel future payments at any time by contacting us.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Monthly support plans</h2>
                <p>
                  Ongoing monthly support plans (Basic, Growth, Premium) can be cancelled at any time. Cancellation
                  takes effect at the end of the current billing period; we do not prorate partial months.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">How to request a refund</h2>
                <p>
                  Email{" "}
                  <a href="mailto:commandcenterai.contact@gmail.com" className="text-electric-400 hover:underline">
                    commandcenterai.contact@gmail.com
                  </a>{" "}
                  with your order details. We'll respond within 2 business days. Approved refunds are returned to
                  your original payment method through Stripe.
                </p>
              </section>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
