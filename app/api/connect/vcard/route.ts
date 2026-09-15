import { NextResponse } from "next/server";
import { CARD_CONTACT } from "@/lib/connect";

export const runtime = "nodejs";

// Serves a real VCARD 3.0 file for the /connect digital business card's
// "Save Contact" button. Generated from lib/connect.ts on every request,
// not a static file, so updating a title or adding a phone number later
// is a one-line change in lib/connect.ts, live everywhere instantly.
function escapeVCardText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildVCard(): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardText(CARD_CONTACT.lastName)};${escapeVCardText(CARD_CONTACT.firstName)};;;`,
    `FN:${escapeVCardText(CARD_CONTACT.fullName)}`,
    `ORG:${escapeVCardText(CARD_CONTACT.org)}`,
    `TITLE:${escapeVCardText(CARD_CONTACT.title)}`,
    `EMAIL;TYPE=INTERNET,WORK:${escapeVCardText(CARD_CONTACT.email)}`,
    `URL;TYPE=WORK:${CARD_CONTACT.website}`,
    `URL;TYPE=WORK:${CARD_CONTACT.academyUrl}`,
    `URL;TYPE=WORK:${CARD_CONTACT.linkedinUrl}`,
    `NOTE:${escapeVCardText(CARD_CONTACT.description)}`,
    "END:VCARD",
    ];
  return lines.join("\r\n") + "\r\n";
}

export async function GET() {
  const vcard = buildVCard();
  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="alfred-acosta-command-center-ai.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
