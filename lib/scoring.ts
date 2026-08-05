import type { AssessmentScores, ComplexityTier, FullAssessmentAnswers } from "./assessment-types";

/**
 * Pure, deterministic scoring engine. No DB access, no side effects — easy to
 * unit test and easy for an admin-editable weight table to slot into later
 * (the buckets below are the natural seams for that; see the TODO markers).
 *
 * All scores are 0-100. Higher = better for the five customer-facing scores.
 * integrationComplexityScore runs the OPPOSITE direction (higher = more
 * complex/costly) and is intentionally excluded from the readiness average —
 * mixing a cost signal into a "how ready are you" number would misrepresent
 * what it means, called out explicitly in the approved plan.
 */

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function scoreAssessment(answers: FullAssessmentAnswers): AssessmentScores {
  const leadResponseScore = scoreLeadResponse(answers);
  const followUpScore = scoreFollowUp(answers);
  const appointmentAutomationScore = scoreAppointmentAutomation(answers);
  const customerServiceScore = scoreCustomerService(answers);
  const operationalEfficiencyScore = scoreOperationalEfficiency(answers);
  const integrationComplexityScore = scoreIntegrationComplexity(answers);

  const overallReadinessScore = Math.round(
    (leadResponseScore +
      followUpScore +
      appointmentAutomationScore +
      customerServiceScore +
      operationalEfficiencyScore) /
      5
  );

  const complexityTier = deriveComplexityTier(answers, integrationComplexityScore);

  return {
    leadResponseScore,
    followUpScore,
    appointmentAutomationScore,
    customerServiceScore,
    operationalEfficiencyScore,
    integrationComplexityScore,
    overallReadinessScore,
    complexityTier,
  };
}

// TODO(admin-config): move these bucket weights into PricingConfig rows
// (group: "scoring_weight") so they're editable without a deploy, per the
// approved plan's admin-controls requirement. Hardcoded for Phase 1.

function scoreLeadResponse(a: FullAssessmentAnswers): number {
  const flow = a.customerFlow;
  if (!flow) return 50; // neutral default for an incomplete section
  let score = 50;
  const speedMap: Record<string, number> = {
    instant: 40,
    "under_1_hour": 25,
    "same_day": 5,
    "1+_days": -25,
  };
  score += speedMap[flow.responseSpeed] ?? 0;
  score += flow.afterHoursCoverage ? 15 : -10;
  score += flow.missedCallFollowUp ? 15 : -15;
  return clamp(score);
}

function scoreFollowUp(a: FullAssessmentAnswers): number {
  const sales = a.salesFollowUp;
  if (!sales) return 50;
  let score = 40;
  score += sales.followUpByEmail ? 10 : 0;
  score += sales.followUpByText ? 10 : 0;
  score += sales.followUpAutomated ? 25 : -10;
  score += sales.lostLeadsTracked ? 10 : -5;
  const attemptsMap: Record<string, number> = {
    "0": -20,
    "1": -5,
    "2-3": 10,
    "4+": 15,
  };
  score += attemptsMap[sales.followUpAttempts] ?? 0;
  return clamp(score);
}

function scoreAppointmentAutomation(a: FullAssessmentAnswers): number {
  const appt = a.appointmentsService;
  if (!appt || !appt.schedulesAppointments) return 50;
  let score = 40;
  score += appt.usesCalendarPlatform ? 15 : -10;
  score += appt.sendsReminders ? 20 : -15;
  score += appt.followsUpMissedAppointments ? 20 : -10;
  return clamp(score);
}

function scoreCustomerService(a: FullAssessmentAnswers): number {
  const appt = a.appointmentsService;
  if (!appt) return 50;
  let score = 55;
  score += appt.repetitiveFaqBurden ? -20 : 10; // heavy repeat-question burden = lower current-state score
  score += appt.needs24_7 ? -10 : 5; // stated need not yet met = signal, not penalty on the business
  score += appt.needsBilingual ? -5 : 5;
  return clamp(score);
}

function scoreOperationalEfficiency(a: FullAssessmentAnswers): number {
  const sales = a.salesFollowUp;
  const softwareIntegrations = a.softwareIntegrations;
  let score = 50;
  if (sales) {
    score += sales.usesCrm ? 15 : -15;
    score += sales.proposalsManual ? -15 : 10;
  }
  if (softwareIntegrations) {
    score += softwareIntegrations.needsCustomReports ? -5 : 5;
  }
  return clamp(score);
}

/**
 * Cost/complexity signal — higher = more integration work, more cost, more
 * build time. Feeds the pricing floor and path-routing logic, not the
 * customer-facing readiness score.
 */
function scoreIntegrationComplexity(a: FullAssessmentAnswers): number {
  const si = a.softwareIntegrations;
  let score = 10;
  if (si) {
    score += Math.min(si.systemsInUse.length * 6, 42); // more systems = more integration surface
    score += si.multiLocation ? 15 : 0;
    score += si.multiUser ? 8 : 0;
    score += si.needsPermissions ? 8 : 0;
    score += si.needsDataMigration ? 12 : 0;
    score += si.needsCustomDashboards ? 8 : 0;
    score += si.needsCustomReports ? 7 : 0;
  }
  const ops = a.operationsAutomation;
  if (ops) {
    score += Math.min(ops.processesToImprove.length * 3, 24);
  }
  return clamp(score);
}

function deriveComplexityTier(a: FullAssessmentAnswers, integrationComplexityScore: number): ComplexityTier {
  const si = a.softwareIntegrations;
  const locationCount = a.businessProfile?.locationCount ?? 1;

  // Hard "custom" triggers — highly-customized scope that shouldn't get an
  // instant fixed price no matter how the weighted score comes out.
  const customTriggers =
    (si?.systemsInUse.length ?? 0) >= 6 ||
    (si?.needsDataMigration && si?.needsCustomDashboards) ||
    locationCount >= 4;

  if (customTriggers || integrationComplexityScore >= 75) return "custom";
  if (integrationComplexityScore >= 50) return "high";
  if (integrationComplexityScore >= 28) return "medium";
  return "low";
}
