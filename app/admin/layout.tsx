import type { Metadata } from "next";

// Covers /admin/login AND everything under app/admin/(dashboard) — belt
// and suspenders alongside robots.ts's disallow: a page-level noindex
// still applies even if something somewhere links to an admin URL, which
// a robots.txt disallow alone doesn't guarantee against every crawler.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
