/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // A Content-Security-Policy is deliberately not set here — Stripe
          // Checkout, PDF rendering, and Tailwind's inline styles all need
          // specific allowances, and an overly strict CSP added blind (with
          // no way to test it against a live browser from this environment)
          // risks silently breaking checkout. Add one incrementally, in a
          // real browser, once the site is live.
        ],
      },
    ];
  },
};

export default nextConfig;
