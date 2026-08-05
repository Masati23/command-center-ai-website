import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Minimal in-memory rate limiting per server instance — a real deployment
// on Vercel is stateless across invocations, so this is a first layer, not
// a complete defense. Worth pairing with a proper rate-limit service
// (e.g. Upstash) before this handles real traffic at scale.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rateLimitKey = `${ip}:${parsed.data.email}`;
  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const admin = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  // Always run bcrypt.compare, even on a missing user, against a dummy hash
  // — prevents timing attacks that could reveal whether an email exists.
  const validPassword = await bcrypt.compare(
    parsed.data.password,
    admin?.passwordHash ?? "$2a$10$invalidsaltinvalidsaltinvalidsaltinvalidsalt"
  );

  if (!admin || !validPassword) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createSession({ adminId: admin.id, email: admin.email, role: admin.role });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
