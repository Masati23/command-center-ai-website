import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, Badge } from "@/components/ui";
import AssessmentWizard from "@/components/assessment/AssessmentWizard";

export const metadata: Metadata = {
  title: "Free AI Business Assessment",
  description:
    "Answer a few questions about your business and get a personalized AI workforce recommendation with estimated pricing.",
};

export default function AssessmentPage() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-5 flex justify-center">
              <Badge>Free AI Business Assessment</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Let's find the right AI systems for your business
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-silver-400">
              A few questions about how your business runs today — takes about 5–8 minutes. We'll
              recommend a workforce, estimate pricing, and point you to the right next step.
            </p>
          </div>

          <AssessmentWizard />

          <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-silver-500">
            Privacy notice: your answers are used only to prepare your recommendation and estimate,
            and to follow up about your project. We don't sell your information.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
