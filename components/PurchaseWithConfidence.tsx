import React from "react";
import { GlassCard } from "./ui";

const points = [
  {
    title: "Processed securely by Stripe",
    description: "Payments are handled entirely by Stripe, a PCI Level 1 certified payment processor used by millions of businesses worldwide.",
  },
  {
    title: "Your card details go straight to Stripe",
    description: "Full card information is submitted directly to Stripe's secure servers — it never passes through or touches Command Center AI's systems.",
  },
  {
    title: "We never store your card information",
    description: "Command Center AI does not store, log, or have access to your full card number, CVV, or expiration date, at any point.",
  },
  {
    title: "Industry-standard protection",
    description: "Your personal and payment information is protected using the same encryption and security standards banks rely on.",
  },
];

/**
 * "Purchase with Confidence" trust section — placed near every checkout
 * surface. Only makes factual, verifiable claims about how Stripe Checkout
 * actually works; no fake badges, review counts, or guarantees.
 */
export default function PurchaseWithConfidence() {
  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5eb3ff" strokeWidth="2">
          <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="font-semibold text-white">Purchase with Confidence</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {points.map((p) => (
          <div key={p.title} className="flex gap-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0 text-electric-400">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-silver-200">{p.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-silver-500">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
