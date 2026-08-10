/**
 * Seeds the product catalog and default pricing/bundle config.
 * Run with: npm run db:seed  (requires DATABASE_URL to be set and
 * `npx prisma migrate dev --name init` to have been run at least once).
 *
 * PRICING NOTE: the 4 core products use the confirmed current prices —
 * $599 / $899 / $1,499 / $2,099. The Business Command Center price was
 * corrected from $2,999 to $2,099 across the entire project (marketing
 * site components, this seed file, and the pricing floor below) as of the
 * Phase 2 pricing correction.
 *
 * Module prices below are starting estimates, not previously approved
 * figures — treat them as an editable first draft in the admin dashboard,
 * not a final price list.
 */
import { PrismaClient, ProductCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

interface SeedProduct {
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number; // cents
  monthlySupport: number; // cents
  buildTimeDays: number;
  features: string[];
  tags: string[];
  sortOrder: number;
}

const products: SeedProduct[] = [
  // ---- Core ----
  {
    slug: "ai-website-chatbot",
    name: "AI Website Chatbot",
    description: "A tireless front-line assistant that greets, answers, and captures every visitor.",
    category: "CORE",
    basePrice: 59900,
    monthlySupport: 9900,
    buildTimeDays: 7,
    features: ["Answers customer questions 24/7", "Captures leads", "Handles FAQs", "Website integration", "Live AI chat", "Email notifications"],
    tags: ["website-support", "lead-capture", "faq-burden", "after-hours"],
    sortOrder: 1,
  },
  {
    slug: "ai-appointment-booking",
    name: "AI Appointment Booking Bot",
    description: "Let customers book themselves in — day or night — with zero back-and-forth.",
    category: "CORE",
    basePrice: 89900,
    monthlySupport: 19900,
    buildTimeDays: 10,
    features: ["Appointment scheduling", "Calendar integration", "Customer reminders", "Contact capture", "Business hours"],
    tags: ["appointment-booking", "scheduling", "reminders", "after-hours"],
    sortOrder: 2,
  },
  {
    slug: "ai-lead-generation",
    name: "AI Lead Generation System",
    description: "Find, qualify, and nurture new business automatically, every single day.",
    category: "CORE",
    basePrice: 149900,
    monthlySupport: 29900,
    buildTimeDays: 14,
    features: ["Business lead discovery", "Contact management", "Lead qualification", "Pipeline tracking", "Follow-up automation"],
    tags: ["lead-generation", "lead-qualification", "crm", "follow-up"],
    sortOrder: 3,
  },
  {
    slug: "ai-business-command-center",
    name: "AI Business Command Center",
    description: "One executive dashboard that runs your entire operation on autopilot.",
    category: "CORE",
    basePrice: 299900,
    monthlySupport: 39900,
    buildTimeDays: 30,
    features: ["Executive dashboard", "AI Assistant", "Workflow automation", "Lead Management", "Analytics", "Reports", "Business insights"],
    tags: ["reporting", "workflow-automation", "crm", "dashboards", "multi-location"],
    sortOrder: 4,
  },
  // ---- Priority 5 expansion: 6 new done-for-you services (distinct from
  // the assessment-engine "module" catalog below — these are standalone
  // customer-facing services with their own direct checkout, not add-on
  // modules bundled into a proposal). ----
  {
    slug: "ai-customer-support-system",
    name: "AI Customer Support System",
    description: "Answers customer questions, organizes requests, and makes sure nothing falls through the cracks.",
    category: "CORE",
    basePrice: 129900,
    monthlySupport: 19900,
    buildTimeDays: 10,
    features: ["Answers customer questions", "Organizes support requests", "Escalates serious issues", "Tracks frequently asked questions", "Identifies missing answers"],
    tags: ["customer-support", "faq-burden", "escalation"],
    sortOrder: 5,
  },
  {
    slug: "ai-voice-receptionist-phone-agent",
    name: "AI Voice Receptionist and Phone Agent",
    description: "Answers your business calls, books appointments, and covers you after hours.",
    category: "CORE",
    basePrice: 179900,
    monthlySupport: 29900,
    buildTimeDays: 14,
    features: ["Answers business calls", "Books appointments", "Takes messages", "Qualifies callers", "Routes important calls", "After-hours coverage"],
    tags: ["phone-answering", "after-hours", "appointment-booking"],
    sortOrder: 6,
  },
  {
    slug: "ai-sales-crm-automation",
    name: "AI Sales and CRM Automation",
    description: "Captures leads, keeps your pipeline current, and follows up so opportunities don't go cold.",
    category: "CORE",
    basePrice: 199900,
    monthlySupport: 29900,
    buildTimeDays: 14,
    features: ["Captures leads", "Organizes customer information", "Updates sales pipelines", "Sends follow-up messages", "Creates reminders", "Tracks opportunities"],
    tags: ["crm", "lead-generation", "follow-up"],
    sortOrder: 7,
  },
  {
    slug: "ai-estimates-invoicing",
    name: "AI Estimates, Invoices and Payment Follow-Up",
    description: "Creates estimates, sends invoices, and follows up on payments automatically.",
    category: "CORE",
    basePrice: 149900,
    monthlySupport: 19900,
    buildTimeDays: 10,
    features: ["Creates or organizes estimates", "Sends invoices", "Sends payment reminders", "Tracks unpaid balances", "Notifies the business about overdue payments"],
    tags: ["estimate-generation", "invoicing", "sales"],
    sortOrder: 8,
  },
  {
    slug: "ai-reputation-management",
    name: "AI Reputation and Review Management",
    description: "Requests reviews, watches your reputation, and flags unhappy customers early.",
    category: "CORE",
    basePrice: 99900,
    monthlySupport: 14900,
    buildTimeDays: 7,
    features: ["Requests customer reviews", "Monitors customer feedback", "Drafts professional responses", "Alerts the business about unhappy customers", "Organizes reputation activity"],
    tags: ["reputation", "reviews", "follow-up"],
    sortOrder: 9,
  },
  {
    slug: "ai-employee-knowledge-assistant",
    name: "AI Employee Knowledge and Training Assistant",
    description: "Answers employee questions from your own procedures and supports onboarding.",
    category: "CORE",
    basePrice: 179900,
    monthlySupport: 24900,
    buildTimeDays: 14,
    features: ["Answers employee questions using approved company information", "Searches company procedures", "Explains policies", "Supports employee onboarding", "Organizes training information"],
    tags: ["internal-support", "onboarding", "knowledge-base"],
    sortOrder: 10,
  },
  {
    slug: "ai-agents-for-business",
    name: "AI Agents for Business",
    description:
      "A real custom AI agent built to work inside your business — not a simple chatbot. Lead qualification, customer support, workflow automation, tool/CRM integrations, and automated follow-up, with human approval steps where needed.",
    category: "CORE",
    basePrice: 399900,
    monthlySupport: 39900,
    buildTimeDays: 21,
    features: ["Lead qualification", "Workflow automation", "Tool and API integrations", "CRM integration", "Human approval steps where needed", "Automated follow-up"],
    tags: ["ai-agent", "workflow-automation", "custom-integration"],
    sortOrder: 11,
  },
  {
    slug: "ai-security-hardening",
    name: "AI & Business Data Security Hardening",
    description:
      "A defensive security review and hardening pass on your AI systems and business data — credentials, access controls, secrets, integrations, and backup planning, reviewed and tightened. Not a guarantee of security, professional penetration testing, or a regulatory/compliance certification.",
    category: "CORE",
    basePrice: 349900,
    monthlySupport: 29900,
    buildTimeDays: 14,
    features: ["AI and business system security review", "Credential and API key protection", "Access control review", "Secrets and environment configuration", "Prompt-injection risk mitigation", "Backup and recovery planning"],
    tags: ["security", "hardening", "data-protection"],
    sortOrder: 12,
  },
  {
    slug: "ai-data-analytics-business-intelligence",
    name: "AI Data Analytics & Business Intelligence",
    description:
      "An owner-level dashboard that connects your business data, defines the KPIs that matter, and turns visitor, sales, and marketing activity into clear, automated reporting and AI-assisted insight.",
    category: "CORE",
    basePrice: 499900,
    monthlySupport: 39900,
    buildTimeDays: 21,
    features: ["Connects your business data sources", "Custom owner dashboard", "Defines the KPIs that matter to you", "Sales and revenue analytics", "Automated reporting", "AI-assisted business insights"],
    tags: ["analytics", "business-intelligence", "dashboard"],
    sortOrder: 13,
  },
  // ---- Modules ----
  {
    slug: "ai-voice-receptionist",
    name: "AI Voice Receptionist",
    description: "Answers every call, screens and routes, and never puts a customer on hold.",
    category: "MODULE",
    basePrice: 129900,
    monthlySupport: 24900,
    buildTimeDays: 14,
    features: ["24/7 call answering", "Call routing", "Voicemail transcription", "Bilingual support available"],
    tags: ["phone-answering", "after-hours", "missed-call", "bilingual"],
    sortOrder: 10,
  },
  {
    slug: "ai-missed-call-textback",
    name: "Missed-Call Text-Back Bot",
    description: "Every missed call gets an instant text so no lead goes cold.",
    category: "MODULE",
    basePrice: 39900,
    monthlySupport: 7900,
    buildTimeDays: 5,
    features: ["Instant text on missed call", "Configurable message templates", "Lead capture"],
    tags: ["missed-call", "sms", "lead-capture"],
    sortOrder: 11,
  },
  {
    slug: "ai-sms-assistant",
    name: "AI SMS Assistant",
    description: "Two-way texting that qualifies leads and books appointments over SMS.",
    category: "MODULE",
    basePrice: 59900,
    monthlySupport: 12900,
    buildTimeDays: 7,
    features: ["Two-way SMS", "Automated replies", "Appointment booking via text"],
    tags: ["sms", "follow-up", "appointment-booking"],
    sortOrder: 12,
  },
  {
    slug: "ai-email-assistant",
    name: "AI Email Assistant",
    description: "Drafts, sends, and follows up on email automatically, in your voice.",
    category: "MODULE",
    basePrice: 49900,
    monthlySupport: 9900,
    buildTimeDays: 6,
    features: ["Automated replies", "Follow-up sequences", "Inbox triage"],
    tags: ["email", "follow-up"],
    sortOrder: 13,
  },
  {
    slug: "ai-follow-up-assistant",
    name: "AI Follow-Up Assistant",
    description: "Chases every lead with the right message at the right time until they respond.",
    category: "MODULE",
    basePrice: 69900,
    monthlySupport: 14900,
    buildTimeDays: 8,
    features: ["Multi-touch sequences", "Channel mixing (email + SMS)", "Lost-lead recovery"],
    tags: ["follow-up", "lead-generation", "sms", "email"],
    sortOrder: 14,
  },
  {
    slug: "ai-review-assistant",
    name: "AI Review Request Bot",
    description: "Asks happy customers for a review at exactly the right moment.",
    category: "MODULE",
    basePrice: 34900,
    monthlySupport: 7900,
    buildTimeDays: 4,
    features: ["Automated review requests", "Multi-platform (Google, Facebook, etc.)", "Negative feedback routing"],
    tags: ["reputation", "follow-up"],
    sortOrder: 15,
  },
  {
    slug: "ai-proposal-generator",
    name: "AI Proposal Generator",
    description: "Turns a qualified lead into a professional proposal in minutes, not hours.",
    category: "MODULE",
    basePrice: 79900,
    monthlySupport: 14900,
    buildTimeDays: 10,
    features: ["Auto-generated proposals", "Branded templates", "E-signature ready"],
    tags: ["proposal-generation", "sales"],
    sortOrder: 16,
  },
  {
    slug: "ai-estimate-generator",
    name: "AI Estimate Generator",
    description: "Fast, consistent estimates generated from your own pricing rules.",
    category: "MODULE",
    basePrice: 79900,
    monthlySupport: 14900,
    buildTimeDays: 10,
    features: ["Rule-based estimating", "Branded output", "CRM sync"],
    tags: ["estimate-generation", "sales"],
    sortOrder: 17,
  },
  {
    slug: "ai-crm-assistant",
    name: "AI CRM Assistant",
    description: "Keeps your CRM up to date automatically — no more stale pipeline data.",
    category: "MODULE",
    basePrice: 89900,
    monthlySupport: 17900,
    buildTimeDays: 12,
    features: ["Auto-logging", "Data enrichment", "Pipeline hygiene"],
    tags: ["crm", "operational-efficiency"],
    sortOrder: 18,
  },
  {
    slug: "ai-reporting-dashboard",
    name: "AI Reporting Dashboard",
    description: "One clear view of what's working, updated automatically.",
    category: "MODULE",
    basePrice: 99900,
    monthlySupport: 19900,
    buildTimeDays: 14,
    features: ["Custom dashboards", "Automated reports", "Multi-source data"],
    tags: ["reporting", "dashboards"],
    sortOrder: 19,
  },
  {
    slug: "ai-knowledge-base",
    name: "AI Knowledge Base Assistant",
    description: "Answers the questions your staff answers all day, instantly and consistently.",
    category: "MODULE",
    basePrice: 59900,
    monthlySupport: 12900,
    buildTimeDays: 8,
    features: ["Trained on your docs", "Instant answers", "Staff + customer facing modes"],
    tags: ["faq-burden", "internal-support"],
    sortOrder: 20,
  },
  {
    slug: "ai-employee-assistant",
    name: "AI Internal Employee Assistant",
    description: "An internal AI teammate for policy questions, scheduling, and repetitive requests.",
    category: "MODULE",
    basePrice: 99900,
    monthlySupport: 19900,
    buildTimeDays: 14,
    features: ["Internal Q&A", "Task routing", "Document lookup"],
    tags: ["internal-support", "operational-efficiency"],
    sortOrder: 21,
  },
  {
    slug: "ai-marketing-assistant",
    name: "AI Marketing Assistant",
    description: "Keeps content and campaigns moving without a full-time marketer.",
    category: "MODULE",
    basePrice: 89900,
    monthlySupport: 17900,
    buildTimeDays: 12,
    features: ["Campaign drafting", "Content calendar", "Performance summaries"],
    tags: ["marketing"],
    sortOrder: 22,
  },
  {
    slug: "ai-operations-assistant",
    name: "AI Operations Assistant",
    description: "Runs recurring operational workflows so nothing falls through the cracks.",
    category: "MODULE",
    basePrice: 99900,
    monthlySupport: 19900,
    buildTimeDays: 14,
    features: ["Workflow automation", "Task tracking", "Cross-tool orchestration"],
    tags: ["operational-efficiency", "workflow-automation"],
    sortOrder: 23,
  },
];

async function main() {
  console.log("Seeding products...");
  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log("Seeding bundle rules...");
  await db.bundleRule.deleteMany({});
  await db.bundleRule.createMany({
    data: [
      { minItems: 2, discountPct: 5, isCustomTier: false },
      { minItems: 3, discountPct: 10, isCustomTier: false },
      { minItems: 4, discountPct: 15, isCustomTier: true }, // custom package pricing, see lib/pricing.ts
    ],
  });

  console.log("Seeding pricing config (cost adds + pricing floors, in cents)...");
  const pricingConfig = [
    { key: "integration_cost_per_system", value: 15000, label: "Cost per additional integration", group: "cost_add" },
    { key: "multi_location_cost_per_location", value: 20000, label: "Cost per additional location", group: "cost_add" },
    { key: "migration_cost_flat", value: 30000, label: "Data migration flat fee", group: "cost_add" },
    { key: "dashboard_cost_flat", value: 25000, label: "Custom dashboard/reporting flat fee", group: "cost_add" },
    { key: "bilingual_cost_flat", value: 20000, label: "Bilingual configuration flat fee", group: "cost_add" },
    { key: "pricing_floor_low", value: 59900, label: "Minimum price — low complexity", group: "pricing_floor" },
    { key: "pricing_floor_medium", value: 149900, label: "Minimum price — medium complexity", group: "pricing_floor" },
    { key: "pricing_floor_high", value: 209900, label: "Minimum price — high complexity", group: "pricing_floor" },
  ];
  for (const c of pricingConfig) {
    await db.pricingConfig.upsert({ where: { key: c.key }, update: c, create: c });
  }

  // Seed the first owner-dashboard admin account, only if both env vars are
  // set. Never a hardcoded default — no admin account exists at all until
  // you provide these yourself, deliberately, per the "no hardcoded
  // secrets" requirement.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (adminEmail && adminPassword) {
    console.log(`Seeding admin user ${adminEmail}...`);
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { name: "Owner", email: adminEmail, passwordHash, role: "super_admin" },
    });
  } else {
    console.warn(
      "ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD not set — skipping admin user seed. " +
        "Set both and re-run `npm run db:seed` to create your dashboard login."
    );
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
