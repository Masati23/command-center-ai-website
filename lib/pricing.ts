import type { BundleRule, PricingConfig } from "@prisma/client";
import type { ComplexityTier, FullAssessmentAnswers } from "./assessment-types";
import type { ProductRecommendation } from "./recommendations";

export interface PricingBreakdown {
  basePriceCents: number;
  moduleSubtotalCents: number;
  integrationCostCents: number;
  multiLocationCostCents: number;
  migrationCostCents: number;
  dashboardCostCents: number;
  bilingualCostCents: number;
  subtotalCents: number;
  bundleDiscountPct: number;
  bundleDiscountCents: number;
  pricingFloorCents: number;
  finalEstimateCents: number;
  monthlySupportCents: number;
  isCustomPackage: boolean; // true when 4+ eligible items push this to custom pricing
}

function cfg(config: PricingConfig[], key: string, fallback: number): number {
  return config.find((c) => c.key === key)?.value ?? fallback;
}

/**
 * Deliberately not "sum every starting price." Combines the recommended
 * core product + selected/recommended modules with complexity-driven cost
 * adds, then applies a bundle discount only to eligible standard items, then
 * floors the result by complexity tier so a steep discount can't underprice
 * genuinely complex work. Matches the approved plan's pricing logic exactly.
 */
export function calculatePricing(
  answers: FullAssessmentAnswers,
  recommendations: ProductRecommendation[],
  complexityTier: ComplexityTier,
  bundleRules: BundleRule[],
  pricingConfig: PricingConfig[]
): PricingBreakdown {
  const core = recommendations.find((r) => r.product.category === "CORE" && r.priorityTier === "recommended_first");
  const modules = recommendations.filter((r) => r.product.id !== core?.product.id && r.priorityTier !== "optional_upgrade");

  const basePriceCents = core?.product.basePrice ?? 0;
  const moduleSubtotalCents = modules.reduce((sum, r) => sum + r.product.basePrice, 0);

  const si = answers.softwareIntegrations;
  const integrationCostCents =
    (si?.systemsInUse?.length ?? 0) * cfg(pricingConfig, "integration_cost_per_system", 15000);

  const locationCount = Math.max((answers.businessProfile?.locationCount ?? 1) - 1, 0);
  const multiLocationCostCents = locationCount * cfg(pricingConfig, "multi_location_cost_per_location", 20000);

  const migrationCostCents = si?.needsDataMigration ? cfg(pricingConfig, "migration_cost_flat", 30000) : 0;
  const dashboardCostCents =
    si?.needsCustomDashboards || si?.needsCustomReports ? cfg(pricingConfig, "dashboard_cost_flat", 25000) : 0;
  const bilingualCostCents = answers.appointmentsService?.needsBilingual
    ? cfg(pricingConfig, "bilingual_cost_flat", 20000)
    : 0;

  const subtotalCents =
    basePriceCents +
    moduleSubtotalCents +
    integrationCostCents +
    multiLocationCostCents +
    migrationCostCents +
    dashboardCostCents +
    bilingualCostCents;

  // Bundle discount only applies to "standard" eligible items (core + modules
  // count, complexity cost-adds don't) and only below the 4-item custom
  // threshold — 4+ eligible items route to custom package pricing instead of
  // a flat percentage, per the approved plan.
  const eligibleItemCount = (core ? 1 : 0) + modules.length;
  const applicableRule = [...bundleRules]
    .filter((r) => eligibleItemCount >= r.minItems)
    .sort((a, b) => b.minItems - a.minItems)[0];

  const isCustomPackage = !!applicableRule?.isCustomTier || complexityTier === "custom";
  const bundleDiscountPct = isCustomPackage ? 0 : applicableRule?.discountPct ?? 0;
  const bundleEligibleCents = basePriceCents + moduleSubtotalCents;
  const bundleDiscountCents = Math.round((bundleEligibleCents * bundleDiscountPct) / 100);

  const pricingFloorCents = cfg(
    pricingConfig,
    complexityTier === "high" || complexityTier === "custom"
      ? "pricing_floor_high"
      : complexityTier === "medium"
        ? "pricing_floor_medium"
        : "pricing_floor_low",
    0
  );

  const finalEstimateCents = Math.max(subtotalCents - bundleDiscountCents, pricingFloorCents);

  const monthlySupportCents =
    (core?.product.monthlySupport ?? 0) + modules.reduce((sum, r) => sum + r.product.monthlySupport, 0);

  return {
    basePriceCents,
    moduleSubtotalCents,
    integrationCostCents,
    multiLocationCostCents,
    migrationCostCents,
    dashboardCostCents,
    bilingualCostCents,
    subtotalCents,
    bundleDiscountPct,
    bundleDiscountCents,
    pricingFloorCents,
    finalEstimateCents,
    monthlySupportCents,
    isCustomPackage,
  };
}

export type SalesPath = "standard" | "deposit" | "consultation";

/**
 * Routes the customer to one of the 3 payment paths per the approved plan.
 * Customer can always downgrade (e.g. pick consultation when eligible for
 * standard) but never self-select upward into a fixed price on custom scope.
 */
export function determineSalesPath(
  complexityTier: ComplexityTier,
  integrationCount: number,
  hasCustomWorkflowFlags: boolean
): SalesPath {
  if (complexityTier === "low" && integrationCount <= 2 && !hasCustomWorkflowFlags) {
    return "standard";
  }
  if (complexityTier === "medium" || complexityTier === "high") {
    return "deposit";
  }
  return "consultation";
}

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
