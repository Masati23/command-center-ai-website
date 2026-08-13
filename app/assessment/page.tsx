import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, Badge } from "@/components/ui";
import AssessmentWizard from "@/components/assessment/AssessmentWizard";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo/jsonld";

const title = "Free AI Business Assessment";
const description =
  "Answer a few questions about your business and get a personalized AI workforce recommendation with estimated pricing.";
const pageUrl = `${SITE_URL}/assessment`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: `${title} | Command Center AI`,
    description,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1731, height: 909, alt: "Command Center AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Command Center AI`,
    description,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AssessmentPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Free AI Business Assessment", url: pageUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
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
