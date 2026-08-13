import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, SectionHeading, Badge, GlassCard } from "@/components/ui";
import ConsultCTAButton from "@/components/missed-call-fix/ConsultCTAButton";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd, SITE_URL } from "@/lib/seo/jsonld";

// -----------------------------------------------------------------------
// Industry variants — one reusable page, industry-specific copy swapped in
// via ?industry=. Outbound campaigns can link directly to a variant, e.g.
// /missed-call-fix?industry=property-management. An unknown or missing
// value falls back to the generic multi-industry version below rather than
// 404ing, so a mistyped or old campaign link still lands on a working page.
// -----------------------------------------------------------------------
type IndustrySlug = "property-management" | "auto-repair" | "electrical-contractors";

interface IndustryContent {
  slug: IndustrySlug;
  label: string;
  badge: string;
  heroNote: string;
  examples: string[];
}

const INDUSTRIES: Record<IndustrySlug, IndustryContent> = {
  "property-management": {
    slug: "property-management",
    label: "Property Management",
    badge: "Built for Property Management Companies",
    heroNote:
      "Prospective tenant calls, maintenance requests, and showing requests don't stop at 5pm — but your leasing office does.",
    examples: [
      "Prospective tenant inquiries",
      "Maintenance questions",
      "Showing requests",
      "Repetitive tenant questions",
      "After-hours inquiries",
    ],
  },
  "auto-repair": {
    slug: "auto-repair",
    label: "Auto Repair & Body Shops",
    badge: "Built for Auto Repair & Body Shops",
    heroNote:
      "A driver with a check-engine light or a dented bumper is usually calling more than one shop — the first one to respond often wins the job.",
    examples: [
      "Missed calls during busy bays",
      "Estimate requests",
      "Appointment requests",
      "Repair-status questions",
      "Customers calling multiple shops",
    ],
  },
  "electrical-contractors": {
    slug: "electrical-contractors",
    label: "Electrical Contractors",
    badge: "Built for Electrical Contractors",
    heroNote:
      "Service calls and estimate requests come in while you're on a job site with your hands full — and quote follow-up is easy to let slip.",
    examples: [
      "Service inquiries",
      "Estimate requests",
      "Callback requests",
      "After-hours leads",
      "Quote follow-up opportunities",
    ],
  },
};

function getIndustry(raw: string | string[] | undefined): IndustryContent | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  return INDUSTRIES[value as IndustrySlug] ?? null;
}

const pageUrl = `${SITE_URL}/missed-call-fix`;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const industry = getIndustry(searchParams.industry);
  const title = industry
    ? `Missed Call & Booking Fix for ${industry.label} | Command Center AI`
    : "Missed Call & Booking Fix | Stop Losing Customers | Command Center AI";
  const description = industry
    ? `Stop losing ${industry.label.toLowerCase()} leads to missed calls and slow follow-up. Command Center AI captures the inquiry, responds, and gets you the details — even after hours.`
    : "A missed call shouldn't mean a missed customer. Command Center AI captures missed calls, after-hours inquiries, and website leads so fewer opportunities slip away.";
  const canonicalUrl = industry ? `${pageUrl}?industry=${industry.slug}` : pageUrl;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { type: "website", url: canonicalUrl, title, description },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

// -----------------------------------------------------------------------
// Static copy shared across all variants
// -----------------------------------------------------------------------

const problemPoints = [
  {
    title: "Staff are already helping someone else",
    detail: "Every business only has so many hands — while your team is with one customer, the next call goes unanswered.",
  },
  {
    title: "The call comes in after hours",
    detail: "Evenings, weekends, holidays — inquiries don't wait for business hours, but most phone lines do.",
  },
  {
    title: "Nobody can answer every inquiry",
    detail: "Phone, website form, text — the volume of ways people reach out makes it easy for one to fall through.",
  },
  {
    title: "Website leads sit unanswered",
    detail: "A form submission at 11pm can sit untouched until the next morning, if it's noticed at all.",
  },
  {
    title: "Estimates and callback requests get forgotten",
    detail: "Sticky notes, missed voicemails, and full inboxes are how good leads quietly disappear.",
  },
  {
    title: "The customer just calls the next business instead",
    detail: "Most people don't wait around — they move down their list, and that list rarely has your name twice.",
  },
];

const workflowSteps = [
  { step: "1", title: "Customer reaches out", detail: "By phone, website, or after hours — however they try to contact your business." },
  { step: "2", title: "Inquiry is captured", detail: "Nothing goes to a dead voicemail box or an ignored form submission." },
  { step: "3", title: "Customer gets a response", detail: "An appropriate, timely reply — not silence until you're back at your desk." },
  { step: "4", title: "Information is collected", detail: "Name, contact info, and what they actually need." },
  { step: "5", title: "Booking or callback is handled", detail: "Where appointment scheduling or rescheduling is supported for your setup." },
  { step: "6", title: "You receive the lead", detail: "So your team can follow up and close it — nothing sits waiting to be found." },
];

const deliverables = [
  "Customized inquiry-response workflow built around your business",
  "Business-specific FAQ / knowledge setup",
  "Lead capture (name, contact info, what they need)",
  "Callback or booking workflow where applicable to your setup",
  "Business notifications when a lead comes in",
  "Testing before launch",
  "Basic post-launch monitoring and support",
];

const faqs = [
  {
    question: "Will customers know they're talking to AI?",
    answer:
      "We configure it around your business so the conversation is natural and useful, and it's upfront if a caller or visitor asks directly. The priority is getting them a helpful, accurate response quickly — not disguising how it works.",
  },
  {
    question: "Can this work with my existing phone number?",
    answer:
      "In most cases, yes — we work with the phone number and tools you already use. Your specific setup is confirmed during your free consultation before anything is built.",
  },
  {
    question: "Can it connect to my calendar?",
    answer:
      "Calendar integration for appointment scheduling and rescheduling is supported where your setup permits it. We'll confirm compatibility with your specific calendar and booking tools during your consultation.",
  },
  {
    question: "What happens if the AI can't answer a question?",
    answer:
      "It takes a message and captures the details rather than guessing or making something up — so nothing gets lost, and your team follows up with the full context.",
  },
  {
    question: "Can I see the leads it captures?",
    answer:
      "Yes. Captured leads and their details are sent to your business, and — depending on your setup — visible through the admin dashboard we build for you.",
  },
  {
    question: "Does this replace my employees?",
    answer:
      "No. It's built to catch what would otherwise be missed — after hours, during busy periods, or when a call simply can't be answered in time — not to replace the people who run your business.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Approximately 5–7 business days for a straightforward single-location implementation, when your existing phone, calendar, and workflow integrations permit. More involved setups may take longer, which we'll confirm upfront.",
  },
  {
    question: "Can you customize this for my business?",
    answer:
      "Yes — every implementation is built around your actual business process: your services, your hours, your booking rules, and your existing tools. It isn't a generic script.",
  },
];

export default function MissedCallFixPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const industry = getIndustry(searchParams.industry);
  const ctaSlug = industry ? `missed-call-fix:${industry.slug}` : "missed-call-fix";
  const canonicalUrl = industry ? `${pageUrl}?industry=${industry.slug}` : pageUrl;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Missed Call & Booking Fix", url: canonicalUrl },
  ]);
  const service = serviceJsonLd({
    name: "Missed Call & Booking Fix",
    description:
      "Captures missed calls, after-hours inquiries, and website leads, responds to the customer, collects their information, and gets the lead to the business.",
    url: canonicalUrl,
    serviceType: "AI Lead Capture and Response",
  });
  const faqJsonLd = faqPageJsonLd(faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main>
        {/* 1. HERO */}
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex justify-center">
              <Badge>{industry ? industry.badge : "Missed Call & Booking Fix"}</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Stop Losing Customers When Nobody Answers.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-silver-400 sm:text-lg">
              {industry
                ? industry.heroNote
                : "Potential customers often contact more than one business at a time. When a call goes unanswered or a message sits without a reply, they usually don't wait — they move on to whoever responds first."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ConsultCTAButton productSlug={ctaSlug} variant="primary">
                Book a Free Consultation
              </ConsultCTAButton>
            </div>
          </div>
        </Section>

        {/* 2. THE PROBLEM */}
        <Section className="pt-0">
          <SectionHeading
            eyebrow="The Problem"
            title="Every missed inquiry is a customer who could've been yours"
            description="These situations happen every day in businesses like yours — and each one is a chance for a customer to go somewhere else instead."
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {problemPoints.map((p) => (
              <GlassCard key={p.title} className="p-6">
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{p.detail}</p>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* 3. WHAT THE MISSED CALL & BOOKING FIX DOES */}
        <Section className="pt-0">
          <SectionHeading
            eyebrow="How It Works"
            title="What the Missed Call & Booking Fix does"
            description="A simple, consistent path from first contact to a lead in your hands."
          />
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workflowSteps.map((s) => (
                <GlassCard key={s.step} className="p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-electric-500/15 text-sm font-semibold text-electric-400">
                    {s.step}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver-400">{s.detail}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </Section>

        {/* 4. WHO IT IS FOR */}
        <Section className="pt-0">
          <SectionHeading
            eyebrow="Who It's For"
            title="Built around how your industry actually works"
            description="We're starting with three focus industries where missed calls and slow follow-up have a direct, measurable cost."
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {Object.values(INDUSTRIES).map((ind) => (
              <GlassCard
                key={ind.slug}
                className={`p-6 ${industry?.slug === ind.slug ? "border-electric-500/50" : ""}`}
              >
                {industry?.slug === ind.slug && (
                  <div className="mb-3">
                    <Badge>Your industry</Badge>
                  </div>
                )}
                <h3 className="text-base font-semibold text-white">{ind.label}</h3>
                <ul className="mt-4 space-y-2 text-sm text-silver-400">
                  {ind.examples.map((ex) => (
                    <li key={ex} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric-400" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* 5. WHAT THE CUSTOMER GETS */}
        <Section className="pt-0">
          <SectionHeading eyebrow="What You Get" title="Clear deliverables, nothing vague" />
          <div className="mx-auto mt-10 max-w-3xl">
            <GlassCard className="p-8">
              <ul className="grid gap-3 text-sm text-silver-300 sm:grid-cols-2">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric-400" />
                    {d}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </Section>

        {/* 6. IMPLEMENTATION */}
        <Section className="pt-0">
          <div className="mx-auto max-w-3xl">
            <GlassCard className="p-8 text-center">
              <h2 className="text-xl font-semibold text-white">Implementation</h2>
              <p className="mt-4 text-sm leading-relaxed text-silver-400">
                Timelines depend on your existing phone system, calendar, CRM, website, and workflow — every
                business's setup is a little different. As a general expectation, a straightforward
                single-location implementation takes approximately{" "}
                <span className="text-white">5–7 business days</span> once we have access to what's needed,
                when your integrations permit it. We'll confirm a realistic timeline for your specific setup
                during your free consultation — we don't promise same-day implementation.
              </p>
            </GlassCard>
          </div>
        </Section>

        {/* 7. WHY COMMAND CENTER AI */}
        <Section className="pt-0">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-semibold text-white">Why Command Center AI</h2>
            <p className="mt-4 text-sm leading-relaxed text-silver-400">
              We build practical AI automation around how your business actually operates — your services,
              your hours, your booking rules, and the tools you already use — rather than forcing every
              company into the same generic system.
            </p>
          </div>
        </Section>

        {/* 8. FAQ */}
        <Section className="pt-0">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((f) => (
              <GlassCard key={f.question} className="p-6">
                <h3 className="text-base font-medium text-white">{f.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{f.answer}</p>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* 9. FINAL CTA */}
        <Section className="pt-0">
          <div className="mx-auto max-w-3xl text-center">
            <GlassCard className="p-10">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Stop letting good leads disappear.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-silver-400">
                Book a free consultation and we'll walk through where your business is losing inquiries today
                — and what the Missed Call & Booking Fix would look like for your setup.
              </p>
              <div className="mt-8 flex justify-center">
                <ConsultCTAButton productSlug={ctaSlug} variant="primary">
                  Book a Free Consultation
                </ConsultCTAButton>
              </div>
            </GlassCard>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
