import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://www.commandcenterai.net";
const title = "Command Center AI | AI Command Centers for Businesses";
const description =
  "Command Center AI builds AI systems that automate customer support, lead generation, appointment booking, follow-ups, and business operations. Operate smarter. Scale faster.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Command Center AI",
  },
  description,
  keywords: [
    "AI automation for business",
    "AI chatbot for website",
    "AI appointment booking",
    "AI lead generation",
    "AI command center",
    "business AI systems Houston",
    "AI employee automation",
  ],
  authors: [{ name: "Alfred Joe Acosta", url: siteUrl }],
  creator: "Command Center AI",
  publisher: "Command Center AI",
  applicationName: "Command Center AI",
  category: "Business Software",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Command Center AI",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070b14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Command Center AI",
    image: `${siteUrl}/opengraph-image`,
    url: siteUrl,
    telephone: "+1-832-744-1631",
    email: "alfred@commandcenterai.net",
    founder: {
      "@type": "Person",
      name: "Alfred Joe Acosta",
      jobTitle: "Founder & Chief AI Systems Architect",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    description,
    priceRange: "$449 - $1999",
    areaServed: "US",
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
