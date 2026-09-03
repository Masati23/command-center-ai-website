import Link from "next/link";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment-config";

export const dynamic = "force-dynamic";

// Human label for the wizard's currentSection (1-7) — used on the
// Draft/Abandoned tab to show admins exactly how far a visitor got before
// they stopped. Falls back gracefully if the section config ever changes.
function sectionLabel(currentSection: number): string {
  const idx = Math.max(0, Math.min(currentSection - 1, ASSESSMENT_SECTIONS.length - 1));
  return ASSESSMENT_SECTIONS[idx]?.title ?? `Step ${currentSection}`;
}

// goalsTimelineBudget stores raw option values (e.g. "immediately",
// "1000-2500") — look up the human label from the same field config the
// wizard renders from, so admins never see raw value strings.
const goalsSection = ASSESSMENT_SECTIONS.find((s) => s.key === "goalsTimelineBudget");
function fieldLabel(fieldName: string, value: string | undefined): string | undefined {
  if (!value) return undefined;
  const field = goalsSection?.fields.find((f) => f.name === fieldName);
  return field?.options?.find((o) => o.value === value)?.label ?? value;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { q?: string; tab?: string };
}) {
  const q = searchParams.q?.trim();
  const tab = searchParams.tab === "drafts" ? "drafts" : "completed";

  const [completedAssessments, draftAssessments] = await Promise.all([
    db.assessment.findMany({
      where: {
        status: "SUBMITTED",
        ...(q
          ? {
              customer: {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                  { businessName: { contains: q, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      },
      include: { customer: true, score: true },
      orderBy: { submittedAt: "desc" },
      take: 200,
    }),
    db.assessment.findMany({
      where: { status: { in: ["DRAFT", "ABANDONED"] } },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
  ]);

  // Draft/Abandoned assessments have no Customer relation yet (that's only
  // created on submit) — contact info lives in the businessProfile JSON
  // blob instead, which is what the wizard autosaves on every field change.
  const filteredDrafts = draftAssessments
    .map((a) => {
      const bp = (a.businessProfile as any) ?? {};
      const gtb = (a.goalsTimelineBudget as any) ?? {};
      return {
        id: a.id,
        status: a.status,
        name: bp.fullName as string | undefined,
        businessName: bp.businessName as string | undefined,
        email: bp.email as string | undefined,
        phone: bp.phone as string | undefined,
        currentSection: a.currentSection,
        mainGoal: gtb.mainGoal as string | undefined,
        timeline: gtb.timeline as string | undefined,
        budgetRange: gtb.budgetRange as string | undefined,
        updatedAt: a.updatedAt,
      };
    })
    // A brand-new draft with zero contact info yet (visitor just landed on
    // step 1 and hasn't typed anything) isn't a lead — nothing to follow up
    // on. Only show drafts where at least name or email was captured.
    .filter((d) => d.name || d.email)
    .filter((d) =>
      q
        ? [d.name, d.email, d.businessName].some((v) => v?.toLowerCase().includes(q.toLowerCase()))
        : true
    );

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Leads</h1>
          <p className="mt-1.5 text-sm text-silver-500">
            {tab === "completed" ? "Every completed AI Business Assessment." : "Contact info captured before a visitor left the assessment."}
          </p>
        </div>
        <div className="flex gap-2">
          <form action="/admin/leads" className="flex gap-2">
            <input type="hidden" name="tab" value={tab} />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, business…"
              className="w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-electric-500/50"
            />
          </form>
          {tab === "completed" && (
            <a
              href="/api/admin/export/leads"
              className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-sm text-silver-300 hover:text-white"
            >
              Export CSV
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b border-white/5">
        <Link
          href={`/admin/leads?tab=completed${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={`px-4 py-2.5 text-sm font-medium ${
            tab === "completed" ? "border-b-2 border-electric-500 text-white" : "text-silver-500 hover:text-silver-300"
          }`}
        >
          Completed Leads ({completedAssessments.length})
        </Link>
        <Link
          href={`/admin/leads?tab=drafts${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={`px-4 py-2.5 text-sm font-medium ${
            tab === "drafts" ? "border-b-2 border-electric-500 text-white" : "text-silver-500 hover:text-silver-300"
          }`}
        >
          Draft / Abandoned ({filteredDrafts.length})
        </Link>
      </div>

      {tab === "completed" ? (
        <GlassCard className="mt-6 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-silver-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Readiness</th>
                <th className="px-5 py-3">Complexity</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {completedAssessments.map((a) => (
                <tr key={a.id} className="border-b border-white/5 text-silver-300 last:border-0">
                  <td className="px-5 py-3">{a.customer?.name ?? "—"}</td>
                  <td className="px-5 py-3">{a.customer?.businessName ?? "—"}</td>
                  <td className="px-5 py-3">{a.customer?.email ?? "—"}</td>
                  <td className="px-5 py-3">{a.score?.overallReadinessScore ?? "—"}</td>
                  <td className="px-5 py-3 capitalize">{a.score?.complexityTier ?? "—"}</td>
                  <td className="px-5 py-3">{a.submittedAt?.toLocaleDateString("en-US") ?? "—"}</td>
                  <td className="px-5 py-3">
                    <Link href={`/assessment/results/${a.id}`} className="text-electric-400 hover:underline" target="_blank">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {completedAssessments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-silver-500">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </GlassCard>
      ) : (
        <GlassCard className="mt-6 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-silver-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Last Step</th>
                <th className="px-5 py-3">Goal</th>
                <th className="px-5 py-3">Timeline</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Last Updated</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrafts.map((d) => (
                <tr key={d.id} className="border-b border-white/5 text-silver-300 last:border-0">
                  <td className="px-5 py-3">{d.name ?? "—"}</td>
                  <td className="px-5 py-3">{d.businessName ?? "—"}</td>
                  <td className="px-5 py-3">{d.email ?? "—"}</td>
                  <td className="px-5 py-3">{d.phone ?? "—"}</td>
                  <td className="px-5 py-3">
                    {sectionLabel(d.currentSection)}{" "}
                    <span className="text-silver-500">({d.currentSection}/{ASSESSMENT_SECTIONS.length})</span>
                  </td>
                  <td className="px-5 py-3">{fieldLabel("mainGoal", d.mainGoal) ?? "—"}</td>
                  <td className="px-5 py-3">{fieldLabel("timeline", d.timeline) ?? "—"}</td>
                  <td className="px-5 py-3">{fieldLabel("budgetRange", d.budgetRange) ?? "—"}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{d.updatedAt.toLocaleString("en-US")}</td>
                  <td className="px-5 py-3 capitalize">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        d.status === "ABANDONED" ? "bg-amber-500/15 text-amber-300" : "bg-electric-500/15 text-electric-300"
                      }`}
                    >
                      {d.status === "ABANDONED" ? "Abandoned" : "In Progress"}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredDrafts.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-8 text-center text-silver-500">
                    No draft or abandoned leads with contact info yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
