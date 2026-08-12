import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, SectionHeading, Badge, Button, GlassCard } from "@/components/ui";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd, SITE_URL } from "@/lib/seo/jsonld";

const title = "AI Automation Houston | Business Process Automation | Command Center AI";
const description =
  "Command Center AI builds done-for-you AI automation for Houston businesses — customer support, lead follow-up, appointment booking, and back-office workflows. Starting at $599.";
const pageUrl = `${SITE_URL}/ai-automation-houston`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    url: pageUrl,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "What does \"AI automation\" actually mean for a small business?",
    answer:
      "It means handing repetitive, time-consuming parts of running your business — answering common questions, following up with leads, booking appointments, tracking invoices, requesting reviews — to a system that runs consistently, in the background, without you having to remember to do it. It's not one product; it's a set of AI systems we configure around how your specific business already operates.",
  },
  {
    question: "What parts of a Houston business can actually be automated?",
    answer:
      "The most common starting points are customer communication (a website chatbot or phone receptionist), lead follow-up so new inquiries don't go cold, appointment booking, and reporting. From there, businesses often add invoicing and payment follow-up, review requests, and CRM/pipeline automation as they grow.",
  },
  {
    question: "How fast can an AI automation system go live?",
    answer:
      "Most AI systems are configured and live within 5–10 business days, depending on the complexity of the solution and how quickly we can gather your business details — hours, services, integrations, and the specific rules you want it to follow.",
  },
  {
    question: "Is AI automation affordable for a small or mid-size business?",
    answer:
      "Our packages start at $599 for a single AI Website Chatbot and scale up from there depending on what you need — lead generation, a full command center, or industry-specific systems. Every project starts with a free consultation, and we confirm pricing before anything is built rather than surprising you afterward.",
  },
  {
    question: "Do I have to replace my existing tools and software?",
    answer:
      "In most cases, no. We regularly integrate with calendars, CRMs, websites, and messaging tools you're already using. Tell us what's in place during your free consultation and we'll confirm compatibility before we start.",
  },
  {
    question: "Do I own the AI system once it's built?",
    answer:
      "Yes. Once built, the AI system is yours. Monthly support plans are optional and cover monitoring, updates, and optimization — they're not required for you to keep using what we build.",
  },
];

export default function AiAutomationHoustonPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "AI Automation Houston", url: pageUrl },
  ]);
  const service = serviceJsonLd({
    name: "AI Business Automation for Houston Companies",
    description,
    url: pageUrl,
    serviceType: "AI Business Process Automation",
  });
  const faqJsonLd = faqPageJsonLd(faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex justify-center">
              <Badge>Houston, Texas</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              AI Automation for Houston Businesses
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-silver-400 sm:text-lg">
              Done-for-you AI systems that handle customer communication, lead follow-up, appointment
              booking, and day-to-day operations — built around how your Houston business actually runs.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/#contact" variant="primary">
                Free AI Automation Consultation
              </Button>
              <Button href="/#solutions" variant="secondary">
                See All Solutions
              </Button>
            </div>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            <GlassCard className="p-8">
              <h2 className="text-xl font-semibold text-white">The problem</h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Growing Houston businesses tend to hit the same wall: the owner or a small team is answering
                the same customer questions over and over, chasing leads that go cold because nobody followed
                up fast enough, juggling a booking calendar by hand, and trying to keep invoices, reviews, and
                reporting from slipping through the cracks — all while actually running the business.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Generic software tools help a little, but they still require someone to operate them. None of
                it runs itself.
              </p>
            </GlassCard>
            <GlassCard className="p-8">
              <h2 className="text-xl font-semibold text-white">How Command Center AI solves it</h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                We build custom-configured AI systems — not generic bots — around your services, your tone of
                voice, your booking rules, and the tools you already use. Most businesses start with one system
                and expand into a fuller command center as they see results.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Every engagement starts with a free consultation (or the{" "}
                <a href="/assessment" className="text-electric-400 hover:underline">
                  Free AI Business Assessment
                </a>
                ) so you get a recommendation and estimated pricing before committing to anything.
              </p>
            </GlassCard>
          </div>
        </Section>

        <Section className="pt-0">
          <SectionHeading eyebrow="Where to start" title="AI automation systems we build" />
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "AI Receptionist / Phone Answering",
                copy: "Answers calls, books appointments, and covers after-hours — see our dedicated page for Houston.",
                href: "/ai-receptionist-houston",
              },
              {
                name: "AI Answering Service",
                copy: "24/7 call handling and message-taking for overflow, after-hours, and busy periods.",
                href: "/ai-answering-service-houston",
              },
              {
                name: "AI Website Chatbot",
                copy: "Answers customer questions and captures leads on your website, 24/7.",
                href: "/#ai-website-chatbot",
              },
              {
                name: "AI Lead Generation & Follow-Up",
                copy: "Finds, qualifies, and automatically follows up with new business so leads don't go cold.",
                href: "/#ai-lead-generation",
              },
              {
                name: "AI Business Command Center",
                copy: "One executive dashboard running workflow automation, lead management, and reporting together.",
                href: "/#ai-business-command-center",
              },
              {
                name: "AI Sales and CRM Automation",
                copy: "Keeps your pipeline current and sends follow-ups automatically as opportunities move.",
                href: "/#ai-sales-crm-automation",
              },
            ].map((item) => (
              <GlassCard key={item.name} className="p-6">
                <h3 className="text-base font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{item.copy}</p>
                <a href={item.href} className="mt-4 inline-block text-sm text-electric-400 hover:underline">
                  Learn more →
                </a>
              </GlassCard>
            ))}
          </div>
        </Section>

        <Section className="pt-0">
          <SectionHeading eyebrow="FAQ" title="AI automation questions, answered" />
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((f) => (
              <GlassCard key={f.question} className="p-6">
                <h3 className="text-base font-medium text-white">{f.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{f.answer}</p>
              </GlassCard>
            ))}
          </div>
        </Section>

        <Section className="pt-0">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-silver-500">
              Ready to see full pricing?{" "}
              <a href="/#pricing" className="text-electric-400 hover:underline">
                View packages and monthly support plans
              </a>{" "}
              or start with the{" "}
              <a href="/assessment" className="text-electric-400 hover:underline">
                Free AI Business Assessment
              </a>
              .
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
