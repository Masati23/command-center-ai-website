import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCents } from "@/lib/pricing";

// @react-pdf/renderer builds PDFs from a constrained React-like element
// tree (Document/Page/View/Text) rendered server-side — no browser, no
// Puppeteer, works fine in a Vercel serverless function. Kept deliberately
// plain/professional rather than trying to replicate the site's dark/glass
// theme in print, which reads poorly on paper.

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#1a1a1a" },
  header: { marginBottom: 24, borderBottom: "2 solid #1a6ef0", paddingBottom: 12 },
  brand: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  tagline: { fontSize: 9, color: "#5b6b82", marginTop: 2 },
  h1: { fontSize: 16, fontWeight: 700, marginTop: 20, marginBottom: 8, color: "#0f172a" },
  h2: { fontSize: 12, fontWeight: 700, marginTop: 14, marginBottom: 6, color: "#0f172a" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#5b6b82" },
  value: { fontWeight: 700 },
  productBlock: { marginBottom: 8, padding: 8, backgroundColor: "#f4f6f9", borderRadius: 4 },
  productName: { fontWeight: 700, fontSize: 11 },
  productMeta: { fontSize: 9, color: "#5b6b82", marginTop: 2 },
  disclaimer: { marginTop: 24, fontSize: 8, color: "#8a94a3", lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#8a94a3", textAlign: "center" },
});

interface ProposalPdfProps {
  proposalId: string;
  customerName: string;
  businessName?: string;
  createdAt: string;
  path: "standard" | "deposit" | "consultation";
  recommendedProducts: {
    name: string;
    priorityTier: string;
    basePrice: number;
    monthlySupport: number;
    buildTimeDays: number;
  }[];
  pricing: {
    subtotalCents: number;
    bundleDiscountPct: number;
    bundleDiscountCents: number;
    finalEstimateCents: number;
    monthlySupportCents: number;
    isCustomPackage: boolean;
  };
  overallReadinessScore: number;
}

const tierLabel: Record<string, string> = {
  recommended_first: "Recommended First",
  recommended_next: "Recommended Next",
  optional_upgrade: "Optional Future Upgrade",
};

export function ProposalDocument({
  proposalId,
  customerName,
  businessName,
  createdAt,
  path,
  recommendedProducts,
  pricing,
  overallReadinessScore,
}: ProposalPdfProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>COMMAND CENTER AI</Text>
          <Text style={styles.tagline}>Operate Smarter. Scale Faster.</Text>
        </View>

        <Text style={styles.h1}>AI Workforce Proposal</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Prepared for</Text>
          <Text style={styles.value}>{businessName ?? customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Contact</Text>
          <Text style={styles.value}>{customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{createdAt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Proposal ID</Text>
          <Text style={styles.value}>{proposalId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Automation Readiness Score</Text>
          <Text style={styles.value}>{overallReadinessScore} / 100 (estimated)</Text>
        </View>

        <Text style={styles.h2}>Recommended AI Workforce</Text>
        {recommendedProducts.map((p) => (
          <View key={p.name} style={styles.productBlock}>
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.productMeta}>{tierLabel[p.priorityTier] ?? p.priorityTier}</Text>
            <Text style={styles.productMeta}>
              Starting at {formatCents(p.basePrice)} · {formatCents(p.monthlySupport)}/mo support · ~{p.buildTimeDays}{" "}
              day build
            </Text>
          </View>
        ))}

        <Text style={styles.h2}>Estimated Investment</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{formatCents(pricing.subtotalCents)}</Text>
        </View>
        {pricing.bundleDiscountCents > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Bundle Savings ({pricing.bundleDiscountPct}%)</Text>
            <Text style={styles.value}>-{formatCents(pricing.bundleDiscountCents)}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>{pricing.isCustomPackage ? "Estimated Range" : "Starting At"}</Text>
          <Text style={styles.value}>{formatCents(pricing.finalEstimateCents)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Recommended Monthly Support</Text>
          <Text style={styles.value}>{formatCents(pricing.monthlySupportCents)}/mo</Text>
        </View>

        <Text style={styles.h2}>Next Step</Text>
        <Text>
          {path === "standard" &&
            "This scope is well-defined enough to begin right away — proceed to secure checkout to get started."}
          {path === "deposit" &&
            "This project benefits from a brief scoping conversation. A deposit reserves your build slot and is credited toward your final project price."}
          {path === "consultation" &&
            "This project is custom enough that we'd like to talk it through with you before pricing it — schedule a free consultation to get started."}
        </Text>

        <Text style={styles.disclaimer}>
          All figures in this proposal are estimated or starting-at figures based on the information provided and
          are not a guarantee of final price, timeline, savings, or revenue outcome. Results may vary. Final scope
          and pricing are confirmed prior to project start.
        </Text>

        <Text style={styles.footer} fixed>
          Command Center AI · Houston, Texas · commandcenterai.net
        </Text>
      </Page>
    </Document>
  );
}
