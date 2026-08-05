"use client";

import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";

export interface StatCardData {
  id: string;
  label: string;
  value: React.ReactNode;
  href?: string;
  tooltip?: string;
}

const STORAGE_KEY = "cc_admin_overview_order";

/**
 * Renders the Executive Dashboard's KPI cards in a per-browser persisted
 * order — up/down controls rather than drag-and-drop, since the ask was
 * "allow cards to be reordered," not a specific interaction pattern, and
 * this is far less code to get right (no drag library, no touch-device
 * edge cases) for the same end result.
 */
export default function ReorderableStatGrid({ cards }: { cards: StatCardData[] }) {
  const [order, setOrder] = useState<string[]>(cards.map((c) => c.id));
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const savedOrder: string[] = JSON.parse(stored);
        const knownIds = new Set(cards.map((c) => c.id));
        // Keep only ids that still exist, then append any new cards not in
        // the saved order yet (e.g. after a future feature adds a card).
        const filtered = savedOrder.filter((id) => knownIds.has(id));
        const missing = cards.map((c) => c.id).filter((id) => !filtered.includes(id));
        setOrder([...filtered, ...missing]);
      }
    } catch {
      // Corrupt localStorage value — fall back to default order silently.
    }
  }, [cards]);

  function persist(newOrder: string[]) {
    setOrder(newOrder);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
    } catch {
      // Storage unavailable (private browsing, quota) — reordering still
      // works for this page view, just won't persist.
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  }

  const cardsById = new Map(cards.map((c) => [c.id, c]));
  const orderedCards = order.map((id) => cardsById.get(id)).filter((c): c is StatCardData => !!c);

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setReordering((v) => !v)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-silver-400 hover:text-white"
        >
          {reordering ? "Done" : "Reorder cards"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {orderedCards.map((card, i) => (
          <div key={card.id} className="relative">
            <StatCard label={card.label} value={card.value} href={reordering ? undefined : card.href} tooltip={card.tooltip} />
            {reordering && (
              <div className="absolute right-2 top-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${card.label} earlier`}
                  className="flex h-6 w-6 items-center justify-center rounded bg-navy-900 text-xs text-silver-300 hover:text-white disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === orderedCards.length - 1}
                  aria-label={`Move ${card.label} later`}
                  className="flex h-6 w-6 items-center justify-center rounded bg-navy-900 text-xs text-silver-300 hover:text-white disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
