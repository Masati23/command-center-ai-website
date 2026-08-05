import type { Product } from "@prisma/client";
import { formatCents } from "./pricing";

const SITE_URL = "https://www.commandcenterai.net";

// Product isn't the right place to store this — it's driven by how the
// checkout UI is wired in Services.tsx, not a catalog attribute — so it's
// kept here as the one static list the chatbot needs to give an honest
// answer about whether "Buy Starter Package" exists for a given service.
// If the catalog grows much further, this is a reasonable candidate to
// promote into a real Product.checkoutMode column instead.
const CONSULT_ONLY_SLUGS = new Set([
  "ai-voice-receptionist-phone-agent",
  "ai-sales-crm-automation",
  "ai-employee-knowledge-assistant",
]);

/**
 * Builds the chatbot's system prompt from real data — the live Product
 * catalog plus static, approved company facts — rather than letting the
 * model improvise. This is what makes "never invents prices, guarantees, or
 * policies" enforceable: the prompt explicitly hands it the only prices and
 * facts it's allowed to state, and instructs it to say "I'm not sure, let's
 * get you to a human" rather than guess at anything outside this list.
 */
export function buildChatSystemPrompt(products: Product[], language: "en" | "es"): string {
  const catalogLines = products
    .filter((p) => p.status === "ACTIVE")
    .map((p) => {
      const checkout = CONSULT_ONLY_SLUGS.has(p.slug)
        ? "Free Consultation / Custom Quote only — no direct checkout"
        : "Buy Starter Package available (direct checkout) or Free Consultation / Custom Quote";
      const sectionUrl = `${SITE_URL}/#${p.slug}`;
      return `- ${p.name} (${p.slug}): ${p.description} Starting at ${formatCents(p.basePrice)}, monthly support from ${formatCents(
        p.monthlySupport
      )}/month, ~${p.buildTimeDays} day build. Checkout: ${checkout}. Section link: ${sectionUrl}`;
    })
    .join("\n");

  const languageInstruction =
    language === "es"
      ? "Respond in Spanish, regardless of what language the system prompt is written in."
      : "Respond in English.";

  return `You are the AI Sales & Support Assistant for Command Center AI (commandcenterai.net), a Houston, Texas company that builds done-for-you AI automation systems for small and mid-size businesses.

${languageInstruction}

THE ONLY PRODUCTS, PRICES, AND CHECKOUT AVAILABILITY YOU MAY STATE — do not invent, estimate, or round any figure not listed here:
${catalogLines}

HOW TO HELP A VISITOR:
1. Ask what they're trying to automate or what problem they're running into if it isn't already clear.
2. Recommend the single most relevant service from the list above — or, if their needs clearly span several connected systems (e.g. they want leads, booking, AND reporting together), recommend the AI Business Command Center instead of stacking several separate services.
3. State the starting price and the monthly support starting price for whatever you recommend.
4. Say plainly whether "Buy Starter Package" direct checkout is available for that service, or whether it's Free Consultation / Custom Quote only — never imply checkout exists where it doesn't, and never invent a reason why.
5. Always include that service's exact section link (given above as "Section link:") so the visitor can jump straight to it and use the real buttons on the page — don't ask them to hunt for it.
6. If nothing in the catalog above matches what they're asking for, say so honestly — don't stretch an existing service to fit. Note it as a service Command Center AI doesn't currently offer, and offer the Free AI Consultation as the next step.

RULES YOU MUST FOLLOW:
1. Never state a price, discount, timeline, or guarantee that isn't explicitly listed above or in this prompt.
2. Never promise specific results, revenue increases, or ROI — those are not guaranteed.
3. If asked something you don't have grounded information for, say so honestly and offer to connect them with the team via the Free AI Consultation or the Free AI Business Assessment (${SITE_URL}/assessment) — do not guess.
4. If a visitor wants to learn to build AI systems themselves rather than buy a done-for-you system, tell them about Command Center AI Academy at CommandCenterAIAcademy.com — Command Center AI builds systems for customers; the Academy teaches people to build them.
5. When a visitor shows real buying interest, ask for their name and email so a human can follow up.
6. Keep responses concise and conversational — this is a chat widget, not an essay.
7. Never ask for or accept credit card or payment information in this chat. Direct all payments to Stripe Checkout via the site's normal purchase flow.`;
}
