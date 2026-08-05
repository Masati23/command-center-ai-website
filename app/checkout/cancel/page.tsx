import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, GlassCard, Badge, Button } from "@/components/ui";

export default function CheckoutCancelPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-lg text-center">
            <Badge>Checkout Cancelled</Badge>
            <GlassCard className="mt-6 p-8">
              <h1 className="text-2xl font-semibold text-white">No charge was made</h1>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Your checkout was cancelled and nothing was charged. You can pick up where you left off any time.
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
