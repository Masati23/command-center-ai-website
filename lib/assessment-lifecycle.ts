import { db } from "./db";

/**
 * A draft assessment with no updates in this window is considered
 * abandoned for admin-dashboard reporting purposes ("Track abandoned
 * quotes" — approved plan, admin controls). Editable constant for now;
 * candidate for PricingConfig once the admin dashboard (Phase 8) exists.
 */
export const ABANDONED_AFTER_HOURS = 48;

/**
 * Marks stale DRAFT assessments as ABANDONED. Designed to be called from a
 * scheduled endpoint (see app/api/cron/mark-abandoned/route.ts) rather than
 * inline on every request — abandonment is a background bookkeeping
 * concern, not something that should slow down a live user's request.
 */
export async function markAbandonedAssessments(): Promise<number> {
  const cutoff = new Date(Date.now() - ABANDONED_AFTER_HOURS * 60 * 60 * 1000);

  const stale = await db.assessment.findMany({
    where: { status: "DRAFT", updatedAt: { lt: cutoff } },
    select: { id: true },
  });

  if (stale.length === 0) return 0;

  await db.$transaction([
    db.assessment.updateMany({
      where: { id: { in: stale.map((s) => s.id) } },
      data: { status: "ABANDONED" },
    }),
    db.eventLog.createMany({
      data: stale.map((s) => ({ type: "assessment_abandoned", refId: s.id })),
    }),
  ]);

  return stale.length;
}

/**
 * Resumes an abandoned assessment back to DRAFT — used by the admin
 * "Resume an assessment for a customer" control (Phase 8) and by the
 * wizard itself if a customer returns after their draft was marked
 * abandoned (their localStorage draft ID is still valid).
 */
export async function resumeAssessment(assessmentId: string) {
  const assessment = await db.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) return null;
  if (assessment.status !== "ABANDONED") return assessment;

  const resumed = await db.assessment.update({
    where: { id: assessmentId },
    data: { status: "DRAFT" },
  });
  await db.eventLog.create({ data: { type: "assessment_resumed", refId: assessmentId } });
  return resumed;
}
