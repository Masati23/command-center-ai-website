// Shared types for the AI Business Assessment. The DB stores each section as
// a JSON blob (see prisma/schema.prisma) so these interfaces are the
// authoritative shape — not enforced at the DB layer, so keep this file and
// lib/assessment-config.ts (the field schema driving the UI) in sync.

export interface BusinessProfileAnswers {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  industry: string;
  city: string;
  state: string;
  employeeCount: string; // banded, e.g. "1-5", "6-20", "21-50", "50+"
  locationCount: number;
  yearsInBusiness: string;
  monthlyRevenueRange?: string; // optional
}

export interface CustomerFlowAnswers {
  contactChannels: string[]; // phone, website form, live chat, text, email, social, walk-in, other
  monthlyInquiries: string; // banded
  monthlyLeads: string;
  monthlyAppointments: string;
  avgContractValue?: string;
  responseSpeed: string; // e.g. "instant", "under 1 hour", "same day", "1+ days"
  afterHoursCoverage: boolean;
  missedCallFollowUp: boolean;
}

export interface SalesFollowUpAnswers {
  leadTrackingMethod: string;
  usesCrm: boolean;
  crmName?: string;
  followUpByEmail: boolean;
  followUpByText: boolean;
  followUpAutomated: boolean;
  followUpAttempts: string;
  proposalsManual: boolean;
  lostLeadsTracked: boolean;
  biggestSalesBottleneck: string;
}

export interface AppointmentsServiceAnswers {
  schedulesAppointments: boolean;
  schedulingMethod?: string;
  usesCalendarPlatform: boolean;
  calendarPlatform?: string;
  sendsReminders: boolean;
  followsUpMissedAppointments: boolean;
  repetitiveFaqBurden: boolean;
  needs24_7: boolean;
  needsBilingual: boolean;
}

export interface OperationsAutomationAnswers {
  processesToImprove: string[]; // multi-select from the 14+Other list
  other?: string;
}

export interface SoftwareIntegrationsAnswers {
  systemsInUse: string[]; // multi-select from the 17+Other list
  other?: string;
  multiUser: boolean;
  multiLocation: boolean;
  needsPermissions: boolean;
  needsDataMigration: boolean;
  needsCustomDashboards: boolean;
  needsCustomReports: boolean;
  needsMobileAccess: boolean;
}

export interface GoalsTimelineBudgetAnswers {
  mainGoal: string;
  timeline: string; // "immediately" | "30" | "60" | "90" | "researching"
  budgetRange: string; // "<1000" | "1000-2500" | "2500-5000" | "5000-10000" | "10000+" | "not_sure"
}

export interface FullAssessmentAnswers {
  businessProfile?: BusinessProfileAnswers;
  customerFlow?: CustomerFlowAnswers;
  salesFollowUp?: SalesFollowUpAnswers;
  appointmentsService?: AppointmentsServiceAnswers;
  operationsAutomation?: OperationsAutomationAnswers;
  softwareIntegrations?: SoftwareIntegrationsAnswers;
  goalsTimelineBudget?: GoalsTimelineBudgetAnswers;
}

export type ComplexityTier = "low" | "medium" | "high" | "custom";

export interface AssessmentScores {
  leadResponseScore: number;
  followUpScore: number;
  appointmentAutomationScore: number;
  customerServiceScore: number;
  operationalEfficiencyScore: number;
  integrationComplexityScore: number;
  overallReadinessScore: number;
  complexityTier: ComplexityTier;
}
