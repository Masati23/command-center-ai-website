import { MetadataRoute } from "next";

// Real, indexable routes only — search engines treat in-page anchors
// (#solutions, #pricing, etc.) as the same URL as the page they live on, so
// listing them as separate sitemap entries is invalid and was previously
// diluting the homepage's own entry. Anchors are still reachable via normal
// on-page navigation; they just don't belong in the sitemap.
//
// Deliberately excludes: /admin/** (noindex, private), /checkout/** and
// /assessment/results/[id] (personalized/transactional, noindex — see their
// page-level metadata), and any /api/** route (not a page).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.commandcenterai.net";
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/assessment`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/ai-receptionist-houston`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/ai-automation-houston`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/ai-answering-service-houston`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/legal/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
