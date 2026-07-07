import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || "alfred@commandcenterai.net";

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();
    const { name, email, phone, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const submission = {
      name,
      email,
      phone: phone || "",
      company: company || "",
      message,
      submittedAt: new Date().toISOString(),
      source: "commandcenterai.net — Free AI Consultation form",
    };

    // Always logged — every submission lands in your Vercel Function logs
    // (Project → Logs) as a durable audit trail, even if email/CRM below
    // aren't configured yet.
    console.log("New consultation request:", submission);

    // -----------------------------------------------------------------
    // 1) Immediate email notification via Resend.
    // Setup (takes ~5 minutes):
    //   1. Create a free account at https://resend.com
    //   2. Verify a sending domain (or use their onboarding@resend.dev
    //      sender while testing).
    //   3. Add RESEND_API_KEY to your environment variables
    //      (.env.local for local dev, Vercel Project Settings →
    //      Environment Variables for production).
    // Optional: set CONTACT_NOTIFY_EMAIL to change who receives the
    // notification (defaults to alfred@commandcenterai.net).
    // -----------------------------------------------------------------
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Command Center AI Website <no-reply@commandcenterai.net>",
          to: NOTIFY_EMAIL,
          reply_to: email,
          subject: `New Free AI Consultation request — ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "N/A"}`,
            `Company: ${company || "N/A"}`,
            "",
            message,
          ].join("\n"),
        });
      } catch (emailErr) {
        console.error("Resend email failed:", emailErr);
      }
    } else {
      console.warn(
        "RESEND_API_KEY not set — email notification skipped. See README.md to enable."
      );
    }

    // -----------------------------------------------------------------
    // 2) CRM-ready: forward every submission to a webhook URL.
    // This is a generic integration point — point CRM_WEBHOOK_URL at:
    //   - A Zapier or Make.com "Catch Webhook" trigger (fastest to set
    //     up, no code — connects to almost any CRM in a few clicks)
    //   - An Airtable automation webhook
    //   - HubSpot's Forms API endpoint
    //   - Your own Command Center AI CRM's ingest endpoint, once built
    // Add CRM_WEBHOOK_URL to your environment variables to activate.
    // -----------------------------------------------------------------
    if (process.env.CRM_WEBHOOK_URL) {
      try {
        await fetch(process.env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
      } catch (crmErr) {
        console.error("CRM webhook forward failed:", crmErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
