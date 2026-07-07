# Command Center AI — Website

Production-ready marketing site built with Next.js 14 (App Router), React, TypeScript, and Tailwind CSS.

## Run locally (Mac)

```bash
cd command-center-ai
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Framework preset: Next.js (auto-detected). No config needed.
4. Click Deploy.

## Connect commandcenterai.net (Namecheap)

1. In Vercel: Project → Settings → Domains → add `commandcenterai.net` and `www.commandcenterai.net`.
2. Vercel will show DNS records to add. In Namecheap → Domain List → Manage → Advanced DNS:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com.`
3. Remove any conflicting default Namecheap parking records.
4. Wait for DNS propagation (minutes to a few hours). Vercel auto-issues SSL.

## Replacing the logo with your real file

The logo is currently a coded SVG recreation in `components/Logo.tsx` (`LogoMark`, `LogoFull`).
To use your official logo file instead:

1. Drop the file (transparent PNG or SVG) into `public/`, e.g. `public/logo.png`.
2. Replace the contents of `LogoMark`/`LogoFull` in `components/Logo.tsx` with a `next/image` tag pointing at it.

## Making the contact form fully live (email + CRM)

Every submission is already validated and logged to your server/Vercel Function logs
as a durable record. Two more things turn it into a full lead pipeline:

**1. Instant email notification (~5 minutes to set up)**
1. Create a free account at [resend.com](https://resend.com).
2. Verify a sending domain (or use their shared test sender while you get started).
3. Copy your API key and add it as `RESEND_API_KEY` in your environment variables
   (`.env.local` for local dev, Vercel → Project → Settings → Environment Variables
   for production).
4. Redeploy. Every consultation request now emails `alfred@commandcenterai.net`
   immediately (change the recipient with `CONTACT_NOTIFY_EMAIL`).

**2. CRM connection (whenever you're ready)**
Set `CRM_WEBHOOK_URL` to any webhook endpoint and every submission is POSTed there
as JSON the moment it arrives — no code changes needed. This works out of the box
with:
- A Zapier or Make.com "Catch Webhook" trigger (easiest — connects to almost any CRM,
  spreadsheet, or Slack channel in a few clicks, no code)
- An Airtable automation webhook
- HubSpot's Forms API endpoint
- Your own Command Center AI CRM's ingest endpoint, whenever that's built

The full implementation is in `app/api/contact/route.ts`.

## SEO

- Metadata, Open Graph, Twitter cards, and JSON-LD structured data are in `app/layout.tsx`.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt` automatically.
- `app/opengraph-image.tsx` generates the social preview image on the fly — no static asset needed.
