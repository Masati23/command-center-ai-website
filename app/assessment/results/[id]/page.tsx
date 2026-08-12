import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Section, Badge, GlassCard, Button } from "@/components/ui";
import { db } from "@/lib/db";
import { formatCents } from "@/lib/pricing";
import ProposalActions from "@/components/assessment/ProposalActions";
import CheckoutOptions from "@/components/assessment/CheckoutOptions";
import PurchaseWithConfidence from "@/components/PurchaseWithConfidence";

export const dynamic = "force-dynamic";

// Personalized per-visitor results (name, pricing estimate, proposal) —
// not indexable content, and each one would otherwise be a thin/duplicate
// page competing with the homepage.
export const metadata: Metadata = {
  title: "Your AI Business Assessment Results",
  robots: {
    index: false,
    follow: false,
  },
};

async function getData(id: string) {
  const assessment = await db.assessment.findUnique({
    where: { id },
    include: {
      score: true,
      recommendations: { include: { product: true }, orderBy: { weightScore: "desc" } },
      proposal: true,
    },
  });
  return assessment;
}

const tierLabel: Record<string, string> = {
  recommended_first: "Recommended First",
  recommended_next: "Recommended Next",
  optional_upgrade: "Optional Future Upgrade",
};

const pathCopy: Record<string, { title: string; body: string; cta: string; href: string }> = {
  standard: {
    title: "You're eligible for a standard purchase",
    body: "Your scope looks well-defined enough to price and start right away. Review the plan below and check out securely through Stripe.",
    cta: "Review & Purchase",
    href: "#purchase",
  },
  deposit: {
    title: "Recommended: a project deposit + consultation",
    body: "Your project has enough moving pieces that we'd like to confirm final scope with you before locking in a fixed price. A deposit reserves your build slot and is credited toward your final project price.",
    cta: "Review Deposit Options",
    href: "#purchase",
  },
  consultation: {
    title: "Let's talk this through together",
    body: "Based on your answers, this project is custom enough that we don't want to responsibly guess at pricing. Let's schedule a free consultation instead.",
    cta: "Schedule Free Consultation",
    href: "/#contact",
  },
};

export default async function AssessmentResultsPage({ params }: { params: { id: string } }) {
  const assessment = await getData(params.id);
  if (!assessment || assessment.status !== "SUBMITTED" || !assessment.score || !assessment.proposal) {
    notFound();
  }

  const { score, recommendations, proposal } = assessment;
  const pricing = proposal!.pricingSnapshot as any;
  const path = proposal!.path;
  const copy = pathCopy[path] ?? pathCopy.consultation;

  const grouped = {
    recommended_first: recommendations.filter((r) => r.priorityTier === "recommended_first"),
    recommended_next: recommendations.filter((r) => r.priorityTier === "recommended_next"),
    optional_upgrade: recommendations.filter((r) => r.priorityTier === "optional_upgrade"),
  };

  const priorityItems = [...grouped.recommended_first, ...grouped.recommended_next];
  const estimatedTimelineDays = priorityItems.length
    ? Math.max(...priorityItems.map((r) => r.product.buildTimeDays))
    : 0;

  // Deliberately rough and clearly caveated — not a guaranteed figure.
  const estimatedHoursSaved = Math.round((100 - score!.overallReadinessScore) * 0.6 + priorityItems.length * 3);

  return (
    <>
      <Navbar />
      <main>
        <Section className="pt-40 sm:pt-48">
          <div className="mx-auto max-w-3xl text-center">
            <Badge>Your Assessment Results</Badge>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Here's what we found for your business
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-silver-400">
              Based on the information provided. Results may vary — this is a starting point, not a guarantee.
            </p>
          </div>

          {/* Readiness score */}
          <div className="mx-auto mt-14 max-w-3xl">
            <GlassCard className="p-8 text-center">
              <p className="text-xs uppercase tracking-wide text-silver-500">Automation Readiness Score</p>
              <p className="mt-3 text-6xl font-semibold text-gradient">{score!.overallReadinessScore}</p>
              <p className="mt-1 text-sm text-silver-500">out of 100 — estimated, based on your answers</p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
                {[
                  { label: "Lead Response", value: score!.leadResponseScore },
                  { label: "Follow-Up", value: score!.followUpScore },
                  { label: "Appointments", value: score!.appointmentAutomationScore },
                  { label: "Customer Service", value: score!.customerServiceScore },
                  { label: "Operations", value: score!.operationalEfficiencyScore },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-lg font-semibold text-white">{s.value}</p>
                    <p className="mt-1 text-[10px] text-silver-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Recommended workforce */}
          <div className="mx-auto mt-16 max-w-4xl">
            <h2 className="text-center text-2xl font-semibold text-white">Your Recommended AI Workforce</h2>
            {(["recommended_first", "recommended_next", "optional_upgrade"] as const).map((tier) =>
              grouped[tier].length ? (
                <div key={tier} className="mt-8">
                  <p className="mb-3 text-sm font-medium text-electric-400">{tierLabel[tier]}</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {grouped[tier].map((r) => (
                      <GlassCard key={r.id} className="p-5">
                        <p className="font-semibold text-white">{r.product.name}</p>
                        <p className="mt-1.5 text-sm text-silver-400">{r.product.description}</p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-silver-500">
                          <span>Starting at {formatCents(r.product.basePrice)}</span>
                          <span>{formatCents(r.product.monthlySupport)}/mo support</span>
                          <span>~{r.product.buildTimeDays} day build</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>

          {/* Estimates */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <GlassCard className="p-6 text-center">
              <p className="text-xs uppercase tracking-wide text-silver-500">Estimated Hours/Month Saved</p>
              <p className="mt-2 text-3xl font-semibold text-gradient">~{estimatedHoursSaved}</p>
              <p className="mt-1 text-[11px] text-silver-500">Potential opportunity — results may vary</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <p className="text-xs uppercase tracking-wide text-silver-500">Estimated Timeline</p>
              <p className="mt-2 text-3xl font-semibold text-gradient">~{estimatedTimelineDays || "—"} days</p>
              <p className="mt-1 text-[11px] text-silver-500">From project start</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <p className="text-xs uppercase tracking-wide text-silver-500">Recommended Monthly Support</p>
              <p className="mt-2 text-3xl font-semibold text-gradient">{formatCents(pricing.monthlySupportCents)}</p>
              <p className="mt-1 text-[11px] text-silver-500">Per month, estimated</p>
            </GlassCard>
          </div>

          {/* Pricing summary */}
          <div id="purchase" className="mx-auto mt-16 max-w-2xl scroll-mt-24">
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-white">Estimated Setup Investment</h3>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between text-silver-400">
                  <span>Subtotal</span>
                  <span>{formatCents(pricing.subtotalCents)}</span>
                </div>
                {pricing.bundleDiscountCents > 0 && (
                  <div className="flex justify-between text-electric-400">
                    <span>Bundle Savings ({pricing.bundleDiscountPct}%)</span>
                    <span>-{formatCents(pricing.bundleDiscountCents)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
                  <span>{pricing.isCustomPackage ? "Estimated Range" : "Starting At"}</span>
                  <span>{formatCents(pricing.finalEstimateCents)}</span>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-white/[0.03] p-5">
                <p className="font-semibold text-white">{copy.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{copy.body}</p>

                {path === "consultation" ? (
                  <Button href={copy.href} variant="primary" className="mt-5 w-full">
                    {copy.cta}
                  </Button>
                ) : (
                  <div className="mt-5">
                    <CheckoutOptions
                      proposalId={proposal!.id}
                      availablePlans={path === "deposit" ? ["DEPOSIT"] : ["FULL", "MONTHLY"]}
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <ProposalActions proposalId={proposal!.id} />
              </div>
            </GlassCard>

            {path !== "consultation" && (
              <div className="mt-6">
                <PurchaseWithConfidence />
              </div>
            )}

            <p className="mt-6 text-center text-xs leading-relaxed text-silver-500">
              All pricing is estimated or starting-at until scope is confirmed. This is not a guarantee of final
              price, savings, or revenue outcome.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
