// Single source of truth for the /connect digital business card's contact
// information. Both the page (app/connect/page.tsx) and the vCard API
// route (app/api/connect/vcard/route.ts) read from here, so a future detail
// change (title wording, adding a phone number, swapping the headshot) is
// a one-line edit instead of a hunt through multiple files.
//
// Deliberately isolated from every other lib/ file in this repo -- nothing
// here is imported by, or imports from, checkout/Stripe/chatbot/admin code.

export const CONNECT_URL = "https://commandcenterai.net/connect";

export const CARD_CONTACT = {
    fullName: "Alfred Acosta",
    firstName: "Alfred",
    lastName: "Acosta",
    title: "Founder & CEO",
    org: "Command Center AI",
    description:
          "I build AI systems and automations that help businesses capture leads, automate follow-up, improve workflows and eliminate repetitive work.",
    email: "commandcenterai.contact@gmail.com",
    website: "https://commandcenterai.net",
    academyUrl: "https://commandcenteraiacademy.com",
    linkedinUrl: "https://www.linkedin.com/in/commandcenterai/",
} as const;

export const CARD_CLICK_ACTIONS = [
    "save_contact",
    "email",
    "linkedin",
    "command_center_ai",
    "academy",
  ] as const;

export type CardClickAction = (typeof CARD_CLICK_ACTIONS)[number];

export function isCardClickAction(value: unknown): value is CardClickAction {
    return typeof value === "string" && (CARD_CLICK_ACTIONS as readonly string[]).includes(value);
}
