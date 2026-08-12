import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "https://www.commandcenterai.net/legal/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-3xl">
            <Badge>Legal</Badge>
            <h1 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-sm text-silver-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

            <div className="mt-10 space-y-8 text-sm leading-relaxed text-silver-400">
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">What we collect</h2>
                <p>
                  When you use our contact form, take the AI Business Assessment, or make a purchase, we collect
                  information you provide directly — your name, email, phone number, business details, and the
                  answers you give us. If you complete a purchase, Stripe collects and processes your payment
                  details on our behalf; we do not receive or store your full card number.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">How we use it</h2>
                <p>
                  We use the information you provide to respond to inquiries, prepare recommendations and
                  proposals, process orders, deliver the services you purchase, and provide ongoing support. We do
                  not sell your personal information.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Payment processing</h2>
                <p>
                  All payments are processed by Stripe, Inc. Your card details are submitted directly to Stripe and
                  are governed by{" "}
                  <a href="https://stripe.com/privacy" className="text-electric-400 hover:underline" target="_blank" rel="noreferrer">
                    Stripe's Privacy Policy
                  </a>
                  . We never store your full card number, CVV, or expiration date.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Third-party services</h2>
                <p>
                  We use Stripe for payment processing, and may use email delivery and analytics providers to
                  operate the site and communicate with you. These providers only receive the information necessary
                  to perform their function.
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Your choices</h2>
                <p>
                  You can request a copy of the information we hold about you, ask us to correct it, or ask us to
                  delete it, by contacting us at{" "}
                  <a href="mailto:commandcenterai.contact@gmail.com" className="text-electric-400 hover:underline">
                    commandcenterai.contact@gmail.com
                  </a>
                  .
                </p>
              </section>
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Contact</h2>
                <p>
                  Command Center AI, Houston, Texas.{" "}
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
