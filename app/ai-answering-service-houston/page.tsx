import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, SectionHeading, Badge, Button, GlassCard } from "@/components/ui";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd, SITE_URL } from "@/lib/seo/jsonld";

const title = "AI Answering Service Houston | 24/7 Call Coverage | Command Center AI";
const description =
  "A 24/7 AI answering service for Houston businesses — every call answered, messages taken, urgent calls flagged, no missed customers during busy periods or after hours.";
const pageUrl = `${SITE_URL}/ai-answering-service-houston`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    url: pageUrl,
    title,
    description,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1731, height: 909, alt: "Command Center AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "How is an AI answering service different from an AI receptionist?",
    answer:
      "They run on the same underlying AI Voice Receptionist and Phone Agent system. \"Answering service\" describes the overflow and after-hours use case — catching calls when your team is busy, closed, or unavailable — while \"receptionist\" describes using it as your primary front desk for every call. Many Houston businesses use it for both.",
  },
  {
    question: "Does it work with the business phone number I already have?",
    answer:
      "In most cases, yes — we work with the number and phone system you already use. Tell us what's in place during your free consultation and we'll confirm compatibility before we start.",
  },
  {
    question: "Can it handle more than one call at the same time?",
    answer:
      "Yes — unlike a single front-desk employee, it can answer multiple calls simultaneously, which matters most exactly when a traditional answering service gets overwhelmed: during your busiest hours.",
  },
  {
    question: "What happens if a caller needs a real person urgently?",
    answer:
      "The assistant is built to qualify callers and take messages, and can flag urgent situations so your team knows to follow up personally rather than letting something time-sensitive sit in a queue.",
  },
  {
    question: "Can it take messages and also book appointments?",
    answer:
      "Yes. Appointment scheduling, calendar integration, message-taking, and caller qualification are all part of the standard build, so it's not limited to just taking a name and number.",
  },
  {
    question: "What does an AI answering service cost in Houston?",
    answer:
      "It's built on the AI Voice Receptionist and Phone Agent, starting at $1,799 with monthly support from $299/month plus usage (telephone, transcription, and AI usage are billed separately). This service is available by consultation only, so your exact pricing is confirmed for your call volume and setup before anything is built.",
  },
];

export default function AiAnsweringServiceHoustonPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "AI Answering Service Houston", url: pageUrl },
  ]);
  const service = serviceJsonLd({
    name: "AI Answering Service for Houston Businesses",
    description,
    url: pageUrl,
    serviceType: "AI Call Answering and Overflow Coverage",
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
              AI Answering Service for Houston Businesses
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-silver-400 sm:text-lg">
              Every call answered — during your busiest hours, after you close, and on weekends — without
              routing customers to voicemail or an overwhelmed front desk.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/#contact" variant="primary">
                Free AI Consultation
              </Button>
              <Button href="/#ai-voice-receptionist-phone-agent" variant="secondary">
                See What's Included
              </Button>
            </div>
          </div>
        </Section>

        <Section className="pt-0">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            <GlassCard className="p-8">
              <h2 className="text-xl font-semibold text-white">The problem</h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Traditional answering services read from a fixed script and can't check your calendar, answer
                real questions, or actually book anything — they just take a message and pass it along. And
                when call volume spikes during a busy Houston afternoon, calls still get missed or put on
                hold, right when a new customer is deciding who to hire.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Meanwhile, voicemail after hours and on weekends is often where leads go to disappear —
                most callers simply move on to the next business that picks up.
              </p>
            </GlassCard>
            <GlassCard className="p-8">
              <h2 className="text-xl font-semibold text-white">How Command Center AI solves it</h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Our AI answering service can handle multiple calls at once, qualify each caller, book
                appointments against your real calendar, take detailed messages, and flag anything urgent —
                all configured around your business's actual services and hours, not a generic script.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                If you want the same coverage across your website too, pair it with our{" "}
                <a href="/#ai-website-chatbot" className="text-electric-400 hover:underline">
                  AI Website Chatbot
                </a>{" "}
                or explore the full{" "}
                <a href="/ai-receptionist-houston" className="text-electric-400 hover:underline">
                  AI Receptionist
                </a>{" "}
                setup for a complete front-desk replacement.
              </p>
            </GlassCard>
          </div>
        </Section>

        <Section className="pt-0">
          <SectionHeading eyebrow="AI Answering Service" title="What's included" />
          <div className="mx-auto mt-10 max-w-3xl">
            <GlassCard className="p-8">
              <ul className="grid gap-3 text-sm text-silver-300 sm:grid-cols-2">
                <li>Answers business calls 24/7</li>
                <li>Books appointments</li>
                <li>Takes detailed messages</li>
                <li>Qualifies and flags urgent callers</li>
                <li>Handles simultaneous calls</li>
                <li>After-hours and weekend coverage</li>
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-silver-400">
                Starting at $1,799, with monthly support from $299/month + usage. Telephone, transcription,
                and AI usage charges are billed separately — available by consultation only, so pricing is
                confirmed for your specific call volume before anything is built.
              </p>
              <div className="mt-6">
                <Button href="/#contact" variant="primary">
                  Get Your Free AI Consultation
                </Button>
              </div>
            </GlassCard>
          </div>
        </Section>

        <Section className="pt-0">
          <SectionHeading eyebrow="FAQ" title="AI answering service questions, answered" />
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
              Want the bigger picture?{" "}
              <a href="/ai-automation-houston" className="text-electric-400 hover:underline">
                See AI automation for Houston businesses
              </a>{" "}
              or take the{" "}
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
