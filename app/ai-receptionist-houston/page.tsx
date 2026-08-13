import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, SectionHeading, Badge, Button, GlassCard } from "@/components/ui";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd, SITE_URL } from "@/lib/seo/jsonld";

const title = "AI Receptionist Houston | 24/7 AI Phone Answering | Command Center AI";
const description =
  "AI receptionist services for Houston businesses. Answer every call, book appointments, and cover after-hours — without hiring another front-desk employee. Starting at $1,799.";
const pageUrl = `${SITE_URL}/ai-receptionist-houston`;

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
    question: "What does an AI receptionist actually do for a Houston business?",
    answer:
      "It answers your business phone line, greets the caller, asks the right questions for your industry, books or reschedules appointments on your calendar, takes a message when it can't resolve something, and flags urgent calls for you to handle personally. It's set up around your business — your services, your hours, and your booking rules — not a generic script.",
  },
  {
    question: "Will callers be able to tell they're talking to AI?",
    answer:
      "Most callers are focused on getting their question answered or their appointment booked, not on how the system works. We configure the voice, pacing, and responses around your business so the conversation feels natural, and the assistant is upfront if a caller asks directly.",
  },
  {
    question: "Can it actually book appointments on my real calendar?",
    answer:
      "Yes — calendar integration and appointment scheduling are part of the AI Voice Receptionist and Phone Agent build. It checks real availability before offering a time, so you don't end up double-booked.",
  },
  {
    question: "What happens to calls after hours or on weekends?",
    answer:
      "After-hours coverage is included. Instead of going to voicemail — where a lot of Houston service businesses lose leads to whichever competitor calls the customer back first — the AI receptionist answers, books what it can, and takes a message for anything else.",
  },
  {
    question: "How much does an AI receptionist cost in Houston?",
    answer:
      "The AI Voice Receptionist and Phone Agent starts at $1,799 to build, with monthly support starting at $299/month plus usage (telephone, transcription, and AI usage charges are billed separately from the setup and monthly support price). Because it's available by consultation only, final pricing is confirmed for your specific call volume and setup before anything is built.",
  },
  {
    question: "Do I need to change my business phone number or buy new hardware?",
    answer:
      "In most cases, no — we work with the phone number and tools you already use. Tell us what you're currently on during your free consultation and we'll confirm compatibility before we start.",
  },
];

export default function AiReceptionistHoustonPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "AI Receptionist Houston", url: pageUrl },
  ]);
  const service = serviceJsonLd({
    name: "AI Receptionist for Houston Businesses",
    description,
    url: pageUrl,
    serviceType: "AI Voice Receptionist and Phone Answering",
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
              AI Receptionist Services for Houston Businesses
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-silver-400 sm:text-lg">
              A custom-built AI receptionist that answers every call, books real appointments, and covers
              your phone after hours — so Houston customers reach a helpful voice instead of voicemail.
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
              <h2 className="text-xl font-semibold text-white">The problem Houston businesses run into</h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Houston is a big, spread-out, fast-moving market — customers call from the road, between job
                sites, or on their lunch break, and they usually call more than one business at once. If your
                phone rings through to voicemail during a busy shift, over lunch, after 6pm, or on a Saturday,
                that lead often just calls the next name on the list. For HVAC companies, dental offices, law
                firms, auto shops, and other service businesses, a missed call isn't a minor inconvenience —
                it's a customer who books with someone else.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Hiring a full-time front-desk employee to cover every hour of every day isn't realistic for
                most small and mid-size businesses, and traditional answering services often read from a
                generic script that can't actually check your calendar or answer real questions about your
                services.
              </p>
            </GlassCard>
            <GlassCard className="p-8">
              <h2 className="text-xl font-semibold text-white">How Command Center AI solves it</h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Our AI Voice Receptionist and Phone Agent is built around your business — your services, your
                hours, and your booking rules — not a one-size-fits-all script. It answers calls, qualifies
                the caller, books appointments directly against your real calendar availability, takes
                messages, and covers you after hours and on weekends.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                It pairs naturally with our{" "}
                <a href="/#ai-appointment-booking" className="text-electric-400 hover:underline">
                  AI Appointment Booking Bot
                </a>{" "}
                for calendar-heavy businesses, or with the full{" "}
                <a href="/#ai-business-command-center" className="text-electric-400 hover:underline">
                  AI Business Command Center
                </a>{" "}
                if you want phones, booking, and reporting running together. Every build starts with a free
                consultation so pricing is confirmed for your specific call volume before anything is built.
              </p>
            </GlassCard>
          </div>
        </Section>

        <Section className="pt-0">
          <SectionHeading eyebrow="AI Receptionist" title="What's included" />
          <div className="mx-auto mt-10 max-w-3xl">
            <GlassCard className="p-8">
              <ul className="grid gap-3 text-sm text-silver-300 sm:grid-cols-2">
                <li>Answers business calls</li>
                <li>Books appointments</li>
                <li>Takes messages</li>
                <li>Qualifies callers</li>
                <li>After-hours coverage</li>
                <li>Calendar integration</li>
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-silver-400">
                Starting at $1,799, with monthly support from $299/month + usage. Telephone, transcription, and
                AI usage charges are billed separately from the setup and monthly support price — this service
                is available by consultation only, so pricing is confirmed for your specific setup before
                anything is built.
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
          <SectionHeading eyebrow="FAQ" title="AI receptionist questions, answered" />
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
              Looking for something broader than phone calls?{" "}
              <a href="/ai-automation-houston" className="text-electric-400 hover:underline">
                See AI automation for Houston businesses
              </a>{" "}
              or explore our{" "}
              <a href="/ai-answering-service-houston" className="text-electric-400 hover:underline">
                AI answering service for Houston
              </a>
              . Not sure which fits? Take the{" "}
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
