import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import TrustSecurity from "@/components/TrustSecurity";
import WhyChooseUs from "@/components/WhyChooseUs";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { faqPageJsonLd } from "@/lib/seo/jsonld";

// Mirrors the English copy in components/FAQ.tsx / lib/i18n/translations.ts
// exactly — FAQPage structured data must match the page's own visible text.
// English is always the server-rendered default (see LanguageContext), so
// this is what actually renders on first paint regardless of language.
const homepageFaqs = [
  {
    question: "How long does setup take?",
    answer:
      "Most AI systems are configured and live within 5–10 business days, depending on the complexity of the solution and how quickly we can gather your business details (hours, services, integrations, etc.).",
  },
  {
    question: "Can you customize the system?",
    answer:
      "Yes. Every system is configured around your business — your services, your tone of voice, your booking rules, and your existing tools. Nothing is a generic, one-size-fits-all bot.",
  },
  {
    question: "Do you provide support?",
    answer:
      "Yes. Every project includes an onboarding period, and ongoing monthly support plans are available to keep your system monitored, updated, and optimized long-term.",
  },
  {
    question: "Do I own my system?",
    answer:
      "Yes. Once built, the AI system is yours. Monthly support plans are optional and cover monitoring, updates, and optimization — they are not required for you to keep using what we build.",
  },
  {
    question: "Can it integrate with my existing software?",
    answer:
      "In most cases, yes. We regularly integrate with calendars, CRMs, websites, and messaging tools. Let us know what you're currently using and we'll confirm compatibility before we start.",
  },
  {
    question: "What if I want to learn to build this myself instead?",
    answer:
      "That's what Command Center AI Academy is for. Command Center AI builds AI systems for you; the Academy teaches you to build them yourself. Visit CommandCenterAIAcademy.com to learn more.",
  },
];

export default function Home() {
  const faqJsonLd = faqPageJsonLd(homepageFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <TrustSecurity />
        <WhyChooseUs />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
