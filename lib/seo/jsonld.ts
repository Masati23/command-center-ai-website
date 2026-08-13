// Shared JSON-LD builders. Every field here is either a static fact already
// published elsewhere on the site (email, city, service catalog) or derived
// from real page content passed in by the caller — nothing here invents a
// review, rating, award, employee count, or street address. Where we don't
// have a verifiable fact (e.g. a physical street address), the relevant
// schema field is simply omitted rather than filled with a placeholder.

export const SITE_URL = "https://www.commandcenterai.net";
export const ORG_NAME = "Command Center AI";
export const CONTACT_EMAIL = "commandcenterai.contact@gmail.com";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-header.png`,
    email: CONTACT_EMAIL,
    areaServed: "US",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: ORG_NAME,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/**
 * ProfessionalService, not LocalBusiness — we don't have (and won't invent)
 * a street address, so the stricter LocalBusiness expectations (a mappable
 * physical address) don't apply here. City/region-level service area only.
 */
export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#professionalservice`,
    name: ORG_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    description:
      "Command Center AI builds AI systems that automate customer support, lead generation, appointment booking, follow-ups, and business operations.",
    priceRange: "$599 - $4,999",
    areaServed: "US",
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType,
    provider: { "@id": ORG_ID },
    areaServed: {
      "@type": "City",
      name: "Houston",
    },
  };
}
