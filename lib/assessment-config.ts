// Data-driven field schema for the AI Business Assessment wizard. The UI
// (components/assessment/*) renders purely from this config, so adding,
// removing, or rewording a question is a data change here — not a new
// component. This is also the shape an admin "edit questions" screen would
// eventually write to (Phase 8 — Admin Controls).

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "select"
  | "radio"
  | "checkboxGroup"
  | "number"
  | "boolean"
  | "textarea";

export interface FieldOption {
  value: string;
  label: string;
}

export interface AssessmentField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: FieldOption[];
  placeholder?: string;
  helpText?: string;
  // Only render this field if `dependsOn` field currently equals `equals`.
  dependsOn?: string;
  equals?: string | boolean;
}

export interface AssessmentSection {
  key: string; // matches the Prisma JSON column name
  title: string;
  description: string;
  fields: AssessmentField[];
}

const employeeCountOptions: FieldOption[] = [
  { value: "1-5", label: "1–5" },
  { value: "6-20", label: "6–20" },
  { value: "21-50", label: "21–50" },
  { value: "50+", label: "50+" },
];

const yesNo: FieldOption[] = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export const ASSESSMENT_SECTIONS: AssessmentSection[] = [
  {
    key: "businessProfile",
    title: "Business Profile",
    description: "Tell us about your business.",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "businessName", label: "Business Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "website", label: "Website", type: "url", required: false },
      { name: "industry", label: "Industry", type: "text", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text", required: true },
      { name: "employeeCount", label: "Number of Employees", type: "select", required: true, options: employeeCountOptions },
      { name: "locationCount", label: "Number of Locations", type: "number", required: true },
      {
        name: "yearsInBusiness",
        label: "Years in Business",
        type: "select",
        required: true,
        options: [
          { value: "<1", label: "Less than 1 year" },
          { value: "1-3", label: "1–3 years" },
          { value: "4-10", label: "4–10 years" },
          { value: "10+", label: "10+ years" },
        ],
      },
      {
        name: "monthlyRevenueRange",
        label: "Approximate Monthly Revenue",
        type: "select",
        required: false,
        helpText: "Optional — helps us right-size a recommendation.",
        options: [
          { value: "<10k", label: "Under $10K" },
          { value: "10k-50k", label: "$10K–$50K" },
          { value: "50k-200k", label: "$50K–$200K" },
          { value: "200k+", label: "$200K+" },
        ],
      },
    ],
  },
  {
    key: "customerFlow",
    title: "Current Customer Flow",
    description: "How customers reach you today.",
    fields: [
      {
        name: "contactChannels",
        label: "How do customers currently contact your business?",
        type: "checkboxGroup",
        required: true,
        options: [
          "phone", "website form", "live chat", "text message", "email", "social media", "walk-in", "other",
        ].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })),
      },
      {
        name: "monthlyInquiries",
        label: "Approximately how many customer inquiries are received each month?",
        type: "select",
        required: true,
        options: ["<25", "25-100", "100-300", "300+"].map((v) => ({ value: v, label: v })),
      },
      {
        name: "monthlyLeads",
        label: "Approximately how many leads are received each month?",
        type: "select",
        required: true,
        options: ["<10", "10-50", "50-150", "150+"].map((v) => ({ value: v, label: v })),
      },
      {
        name: "monthlyAppointments",
        label: "Approximately how many appointments are booked each month?",
        type: "select",
        required: false,
        options: ["<10", "10-50", "50-150", "150+"].map((v) => ({ value: v, label: v })),
      },
      { name: "avgContractValue", label: "Average customer or contract value", type: "text", required: false },
      {
        name: "responseSpeed",
        label: "How quickly does the business usually respond to a new inquiry?",
        type: "select",
        required: true,
        options: [
          { value: "instant", label: "Instantly" },
          { value: "under_1_hour", label: "Under 1 hour" },
          { value: "same_day", label: "Same day" },
          { value: "1+_days", label: "1+ days" },
        ],
      },
      { name: "afterHoursCoverage", label: "Are inquiries answered after business hours?", type: "boolean", required: true, options: yesNo },
      { name: "missedCallFollowUp", label: "Are missed calls followed up automatically?", type: "boolean", required: true, options: yesNo },
    ],
  },
  {
    key: "salesFollowUp",
    title: "Sales & Follow-Up",
    description: "How leads are tracked and nurtured.",
    fields: [
      { name: "leadTrackingMethod", label: "How are leads currently tracked?", type: "text", required: true },
      { name: "usesCrm", label: "Is a CRM currently used?", type: "boolean", required: true, options: yesNo },
      { name: "crmName", label: "Which CRM or software is used?", type: "text", required: false, dependsOn: "usesCrm", equals: true },
      { name: "followUpByEmail", label: "Are leads followed up by email?", type: "boolean", required: true, options: yesNo },
      { name: "followUpByText", label: "Are leads followed up by text?", type: "boolean", required: true, options: yesNo },
      { name: "followUpAutomated", label: "Are follow-ups automated?", type: "boolean", required: true, options: yesNo },
      {
        name: "followUpAttempts",
        label: "How many follow-up attempts are normally made?",
        type: "select",
        required: true,
        options: ["0", "1", "2-3", "4+"].map((v) => ({ value: v, label: v })),
      },
      { name: "proposalsManual", label: "Are estimates or proposals generated manually?", type: "boolean", required: true, options: yesNo },
      { name: "lostLeadsTracked", label: "Are lost leads tracked?", type: "boolean", required: true, options: yesNo },
      { name: "biggestSalesBottleneck", label: "What is the biggest sales bottleneck?", type: "textarea", required: true },
    ],
  },
  {
    key: "appointmentsService",
    title: "Appointments & Customer Service",
    description: "How scheduling and support work today.",
    fields: [
      { name: "schedulesAppointments", label: "Does the business schedule appointments?", type: "boolean", required: true, options: yesNo },
      { name: "schedulingMethod", label: "How are appointments currently scheduled?", type: "text", required: false, dependsOn: "schedulesAppointments", equals: true },
      { name: "usesCalendarPlatform", label: "Is a calendar platform used?", type: "boolean", required: true, options: yesNo },
      { name: "calendarPlatform", label: "Which calendar platform?", type: "text", required: false, dependsOn: "usesCalendarPlatform", equals: true },
      { name: "sendsReminders", label: "Are appointment reminders sent?", type: "boolean", required: true, options: yesNo },
      { name: "followsUpMissedAppointments", label: "Are missed appointments followed up?", type: "boolean", required: true, options: yesNo },
      { name: "repetitiveFaqBurden", label: "Are frequently asked questions answered repeatedly by staff?", type: "boolean", required: true, options: yesNo },
      { name: "needs24_7", label: "Does the business need 24/7 customer assistance?", type: "boolean", required: true, options: yesNo },
      { name: "needsBilingual", label: "Does the business need English, Spanish, or bilingual support?", type: "boolean", required: true, options: yesNo },
    ],
  },
  {
    key: "operationsAutomation",
    title: "Operations & Automation",
    description: "Which processes would you like to improve?",
    fields: [
      {
        name: "processesToImprove",
        label: "Select all that apply",
        type: "checkboxGroup",
        required: true,
        options: [
          "Lead generation", "Lead qualification", "Website customer support", "Appointment booking",
          "Phone answering", "Missed-call text back", "Email follow-up", "SMS follow-up",
          "Proposal generation", "Estimate generation", "Review requests", "CRM updates",
          "Reporting", "Invoice reminders", "Internal employee assistance", "Document processing",
          "Workflow automation", "Other",
        ].map((v) => ({ value: v, label: v })),
      },
      { name: "other", label: "Other (optional)", type: "text", required: false },
    ],
  },
  {
    key: "softwareIntegrations",
    title: "Software & Integrations",
    description: "What systems do you use or need connected?",
    fields: [
      {
        name: "systemsInUse",
        label: "Select all that apply",
        type: "checkboxGroup",
        required: false,
        options: [
          "Google Calendar", "Microsoft Outlook Calendar", "Gmail", "Microsoft Outlook Email",
          "HubSpot", "Salesforce", "GoHighLevel", "Zoho", "QuickBooks", "Stripe", "Square",
          "Shopify", "WordPress", "Wix", "Squarespace", "Custom CRM", "Custom API", "Other",
        ].map((v) => ({ value: v, label: v })),
      },
      { name: "other", label: "Other (optional)", type: "text", required: false },
      { name: "multiUser", label: "Will multiple users need access?", type: "boolean", required: true, options: yesNo },
      { name: "multiLocation", label: "Will multiple business locations use the system?", type: "boolean", required: true, options: yesNo },
      { name: "needsPermissions", label: "Are different user permissions required?", type: "boolean", required: true, options: yesNo },
      { name: "needsDataMigration", label: "Is data migration required?", type: "boolean", required: true, options: yesNo },
      { name: "needsCustomDashboards", label: "Are custom dashboards required?", type: "boolean", required: true, options: yesNo },
      { name: "needsCustomReports", label: "Are custom reports required?", type: "boolean", required: true, options: yesNo },
      { name: "needsMobileAccess", label: "Is mobile access required?", type: "boolean", required: true, options: yesNo },
    ],
  },
  {
    key: "goalsTimelineBudget",
    title: "Goals, Timeline & Budget",
    description: "Almost done — this helps us prioritize the right plan.",
    fields: [
      {
        name: "mainGoal",
        label: "What is the main goal?",
        type: "radio",
        required: true,
        options: [
          "Increase leads", "Book more appointments", "Improve response time", "Reduce repetitive work",
          "Improve customer service", "Increase revenue", "Reduce missed opportunities", "Build a complete AI command center",
        ].map((v) => ({ value: v, label: v })),
      },
      {
        name: "timeline",
        label: "When would you like the system launched?",
        type: "radio",
        required: true,
        options: [
          { value: "immediately", label: "Immediately" },
          { value: "30", label: "Within 30 days" },
          { value: "60", label: "Within 60 days" },
          { value: "90", label: "Within 90 days" },
          { value: "researching", label: "Still researching" },
        ],
      },
      {
        name: "budgetRange",
        label: "Approximate investment range",
        type: "radio",
        required: true,
        helpText: "This never disqualifies you — it just helps us recommend the right starting point.",
        options: [
          { value: "<1000", label: "Under $1,000" },
          { value: "1000-2500", label: "$1,000–$2,500" },
          { value: "2500-5000", label: "$2,500–$5,000" },
          { value: "5000-10000", label: "$5,000–$10,000" },
          { value: "10000+", label: "$10,000+" },
          { value: "not_sure", label: "Not sure" },
        ],
      },
    ],
  },
];
