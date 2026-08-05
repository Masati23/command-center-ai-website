import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "cc_admin_session";

/**
 * Protects every /admin/* route except the login page itself. Runs on the
 * Edge runtime (Next.js middleware default), so this verifies the JWT
 * directly with `jose` rather than importing lib/auth.ts's Node-oriented
 * helpers — same AUTH_SECRET, same verification logic, edge-safe.
 */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
