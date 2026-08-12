import type { Metadata } from "next";

// Transactional pages (payment success/cancel) — no unique indexable
// content, tied to a specific order/session, and shouldn't appear in search
// results or accumulate duplicate-canonical weight against the homepage.
export const metadata: Metadata = {
  title: "Checkout",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
