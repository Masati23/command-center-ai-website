import { Resend } from "resend";
import { formatCents } from "./pricing";

const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || "commandcenterai.contact@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://commandcenterai.net";

interface ProposalEmailData {
  proposalId: string;
  assessmentId: string;
  customerName: string;
  customerEmail: string;
  businessName?: string;
  overallReadinessScore: number;
  finalEstimateCents: number;
  isCustomPackage: boolean;
  salesPath: "standard" | "deposit" | "consultation";
  recommendedProductNames: string[];
}

/**
 * Sends the customer their assessment summary and notifies the Command
 * Center AI team — same Resend integration and same graceful-degradation
 * pattern already used in app/api/contact/route.ts (logs and continues if
 * RESEND_API_KEY isn't set yet, rather than failing the whole request).
 */
export async function sendProposalEmails(data: ProposalEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — proposal emails skipped for", data.proposalId);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const resultsUrl = `${APP_URL}/assessment/results/${data.assessmentId}`;
  const priceLabel = data.isCustomPackage ? "Estimated range" : "Starting at";

  try {
    await resend.emails.send({
      from: "Command Center AI <no-reply@commandcenterai.net>",
      to: data.customerEmail,
      subject: "Your AI Business Assessment results",
      text: [
        `Hi ${data.customerName},`,
        "",
        `Your Automation Readiness Score: ${data.overallReadinessScore}/100 (estimated)`,
        "",
        `Recommended AI workforce: ${data.recommendedProductNames.join(", ")}`,
        "",
        `${priceLabel}: ${formatCents(data.finalEstimateCents)}`,
        "",
        "View your full results and next steps here — no obligation:",
        resultsUrl,
        "",
        "— Command Center AI",
      ].join("\n"),
    });
  } catch (err) {
    console.error("Failed to send customer proposal email:", err);
  }

  try {
    await resend.emails.send({
      from: "Command Center AI Website <no-reply@commandcenterai.net>",
      to: NOTIFY_EMAIL,
      subject: `New AI Business Assessment — ${data.businessName ?? data.customerName}`,
      text: [
        `Name: ${data.customerName}`,
        `Business: ${data.businessName ?? "N/A"}`,
        `Email: ${data.customerEmail}`,
        `Readiness score: ${data.overallReadinessScore}/100`,
        `Sales path: ${data.salesPath}`,
        `${priceLabel}: ${formatCents(data.finalEstimateCents)}`,
        `Recommended: ${data.recommendedProductNames.join(", ")}`,
        `Proposal ID: ${data.proposalId}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("Failed to send internal assessment notification:", err);
  }
}

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  businessName?: string;
  amountPaidCents: number;
  amountTotalCents: number;
  status: "PAID" | "PARTIALLY_PAID";
  paymentPlanType: "FULL" | "DEPOSIT" | "MONTHLY";
  receiptUrl?: string | null;
}

/**
 * Sent from the Stripe webhook handler ONLY — after a payment is confirmed
 * server-side, never from the success-page redirect. Same graceful-
 * degradation pattern as sendProposalEmails: logs and continues if
 * RESEND_API_KEY isn't set, never throws back into the webhook handler.
 */
export async function sendOrderConfirmationEmails(data: OrderConfirmationData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — order confirmation emails skipped for", data.orderId);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const remainingCents = data.amountTotalCents - data.amountPaidCents;

  try {
    await resend.emails.send({
      from: "Command Center AI <no-reply@commandcenterai.net>",
      to: data.customerEmail,
      subject: "Payment received — Command Center AI",
      text: [
        `Hi ${data.customerName},`,
        "",
        `We've received your payment of ${formatCents(data.amountPaidCents)}.`,
        data.paymentPlanType === "DEPOSIT" && remainingCents > 0
          ? `This is your project deposit. The remaining balance of ${formatCents(remainingCents)} will be invoiced once your project scope is confirmed.`
          : data.paymentPlanType === "MONTHLY"
            ? "This is the first payment on your monthly plan. Future payments will process automatically each month."
            : "Your order is paid in full.",
        "",
        "Order ID: " + data.orderId,
        data.receiptUrl ? `Receipt: ${data.receiptUrl}` : "",
        "",
        "What happens next: our team will reach out shortly to begin onboarding.",
        "",
        "— Command Center AI",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("Failed to send customer order confirmation email:", err);
  }

  try {
    await resend.emails.send({
      from: "Command Center AI Website <no-reply@commandcenterai.net>",
      to: NOTIFY_EMAIL,
      subject: `New payment received — ${data.businessName ?? data.customerName}`,
      text: [
        `Customer: ${data.customerName}`,
        `Business: ${data.businessName ?? "N/A"}`,
        `Email: ${data.customerEmail}`,
        `Amount: ${formatCents(data.amountPaidCents)}`,
        `Plan: ${data.paymentPlanType}`,
        `Order status: ${data.status}`,
        `Order ID: ${data.orderId}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("Failed to send internal payment notification:", err);
  }
}
