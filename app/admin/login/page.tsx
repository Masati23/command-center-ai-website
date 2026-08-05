"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard, Button } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <GlassCard className="w-full max-w-sm p-8">
        <div className="flex justify-center">
          <LogoMark className="h-10 w-10" />
        </div>
        <h1 className="mt-5 text-center text-xl font-semibold text-white">Owner Dashboard</h1>
        <p className="mt-1.5 text-center text-sm text-silver-500">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-silver-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-electric-500/50"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-silver-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-electric-500/50"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {loading ? "Signing in…" : "Sign In"}
          </Button>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}
        </form>
      </GlassCard>
    </div>
  );
}
