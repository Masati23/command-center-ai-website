"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export interface AdminBadgeCounts {
  newLeads: number;
  newPurchases: number;
  failedPayments: number;
  newChatConversations: number;
}

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-electric-500 px-1 text-[10px] font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function AdminShell({
  children,
  badges,
}: {
  children: React.ReactNode;
  badges?: AdminBadgeCounts;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const navLinks = [
    { label: "Overview", href: "/admin" },
    { label: "Traffic & Visitors", href: "/admin/traffic" },
    { label: "Leads", href: "/admin/leads" },
    { label: "Contact Submissions", href: "/admin/contacts", badge: badges?.newLeads },
    { label: "Consultation Requests", href: "/admin/consultations", badge: badges?.newLeads },
    { label: "Chat Insights", href: "/admin/chatbot", badge: badges?.newChatConversations },
    { label: "Orders & Payments", href: "/admin/orders", badge: (badges?.newPurchases ?? 0) + (badges?.failedPayments ?? 0) },
    { label: "Service Interest", href: "/admin/service-interest" },
    { label: "System Health", href: "/admin/system-health" },
  ];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/admin/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <LogoMark className="h-7 w-7" />
            <span className="text-sm font-semibold text-white">Owner Dashboard</span>
          </div>
          <form onSubmit={handleSearch} className="min-w-0 flex-1 max-w-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, company, email, phone, notes…"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white outline-none placeholder-silver-500 focus:border-electric-500/50"
            />
          </form>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-silver-400 hover:bg-white/5 hover:text-white"
            >
              View Storefront ↗
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-silver-400 hover:bg-white/5 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-white/5 px-6">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
          {navLinks.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  active ? "border-electric-500 text-white" : "border-transparent text-silver-400 hover:text-white"
                }`}
              >
                {link.label}
                {typeof link.badge === "number" && <Badge count={link.badge} />}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
