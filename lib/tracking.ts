export const VISITOR_COOKIE = "cc_visitor_id";

export type SourceBucket =
  | "tiktok"
  | "youtube"
  | "facebook"
  | "instagram"
  | "google"
  | "direct"
  | "other";

const UTM_SOURCE_ALIASES: Record<string, SourceBucket> = {
  tiktok: "tiktok",
  youtube: "youtube",
  yt: "youtube",
  facebook: "facebook",
  fb: "facebook",
  instagram: "instagram",
  ig: "instagram",
  google: "google",
};

const REFERRER_HOST_MAP: { match: (host: string) => boolean; bucket: SourceBucket }[] = [
  { match: (h) => h.includes("tiktok.com"), bucket: "tiktok" },
  { match: (h) => h.includes("youtube.com") || h.includes("youtu.be"), bucket: "youtube" },
  { match: (h) => h.includes("facebook.com") || h.includes("fb.com") || h.includes("m.facebook.com"), bucket: "facebook" },
  { match: (h) => h.includes("instagram.com"), bucket: "instagram" },
  { match: (h) => h.includes("google.") || h.includes("bing.com") || h.includes("duckduckgo.com") || h.includes("yahoo.com"), bucket: "google" },
];

/**
 * Classifies a visitor's traffic source once, at first touch. UTM source
 * wins when present (explicit attribution from a campaign link); falls
 * back to the referrer's hostname when there's no UTM (organic/direct
 * link clicks); "direct" only when neither is present — which also
 * correctly covers traffic with no referrer at all (many mobile apps
 * strip it), not just literal direct navigation.
 */
export function classifySourceBucket(utmSource: string | null, referrer: string | null): SourceBucket {
  if (utmSource) {
    const normalized = utmSource.trim().toLowerCase();
    // A present-but-unrecognized utm_source is still real, explicit
    // attribution (e.g. a campaign tool or platform not in our alias
    // list) — it must never silently collapse into "direct," which
    // specifically means NO attribution at all. The raw utmSource value
    // is preserved on the Visitor row regardless, for the Traffic page.
    return UTM_SOURCE_ALIASES[normalized] ?? "other";
  }
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.toLowerCase();
      const ownHost = "commandcenterai.net";
      if (host.includes(ownHost)) return "direct"; // internal navigation shouldn't count as external referral
      for (const rule of REFERRER_HOST_MAP) {
        if (rule.match(host)) return rule.bucket;
      }
      return "other";
    } catch {
      return "other";
    }
  }
  return "direct";
}

export function classifyDevice(userAgent: string | null): "mobile" | "tablet" | "desktop" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}
