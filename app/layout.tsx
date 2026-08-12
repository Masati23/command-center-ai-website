import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalChatWidget from "@/components/chatbot/ConditionalChatWidget";
import VisitorTracker from "@/components/VisitorTracker";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { organizationJsonLd, websiteJsonLd, professionalServiceJsonLd } from "@/lib/seo/jsonld";

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
  authors: [{ name: "Command Center AI", url: siteUrl }],
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
  const jsonLdBlocks = [organizationJsonLd(), websiteJsonLd(), professionalServiceJsonLd()];

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {jsonLdBlocks.map((block) => (
          <script
            key={block["@type"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
            suppressHydrationWarning
          />
        ))}
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <div className="app-shell">{children}</div>
          <ConditionalChatWidget />
          <VisitorTracker />
        </LanguageProvider>
      </body>
    </html>
  );
}
