"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

const navLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Contact Submissions", href: "/admin/contacts" },
  { label: "Consultation Requests", href: "/admin/consultations" },
  { label: "Chat Insights", href: "/admin/chatbot" },
  { label: "Orders & Payments", href: "/admin/orders" },
  { label: "Service Interest", href: "/admin/service-interest" },
  { label: "System Health", href: "/admin/system-health" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-7 w-7" />
            <span className="text-sm font-semibold text-white">Owner Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-silver-400 hover:bg-white/5 hover:text-white"
          >
            Sign Out
          </button>
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
                className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  active ? "border-electric-500 text-white" : "border-transparent text-silver-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
