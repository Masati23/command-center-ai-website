import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-3xl">
            <Badge>Legal</Badge>
            <h1 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Terms of Service</h1>
            <p className="mt-3 text-sm text-silver-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

            <div className="mt-10 space-y-8 text-sm leading-relaxed text-silver-400">
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Services</h2>
                <p>
                  Command Center AI builds and delivers custom AI automation systems, as described on this website
                  or in a proposal provided to you. Final project scope, deliverables, and timeline are confirmed in
                  writing before work begins.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Pricing</h2>
                <p>
                  Prices shown on this site are starting prices or estimates based on the information you provide.
                  Final pricing for your project is confirmed before you are charged. Estimates are not a guarantee
                  of final cost, timeline, or outcome.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Payment</h2>
                <p>
                  Payments are processed securely through Stripe. Depending on the option you choose, you may pay in
                  full, pay a deposit toward a custom project, or use a monthly payment plan. See our{" "}
                  <a href="/legal/refund-policy" className="text-electric-400 hover:underline">
                    Refund Policy
                  </a>{" "}
                  for details on deposits and cancellations.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Ownership</h2>
                <p>
                  Once a project is delivered and paid for, the AI system built for you is yours. Ongoing monthly
                  support plans are optional and are not required to continue using what was built.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">No guarantees</h2>
                <p>
                  Automation readiness scores, estimated hours saved, and other figures shown on this site are
                  estimates based on the information you provide. They are not a guarantee of specific results,
                  revenue, or savings.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Contact</h2>
                <p>
                  Questions about these terms:{" "}
                  <a href="mailto:commandcenterai.contact@gmail.com" className="text-electric-400 hover:underline">
                    commandcenterai.contact@gmail.com
                  </a>
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
