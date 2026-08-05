import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "cc_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    // Fail loudly rather than silently signing tokens with an empty/weak
    // key — an admin auth system with no configured secret should refuse
    // to issue sessions, not pretend to work insecurely.
    throw new Error(
      "AUTH_SECRET is not set. Generate one (e.g. `openssl rand -base64 32`) and add it to your environment variables."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  adminId: string;
  email: string;
  role: string;
}

export async function createSession(session: AdminSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.adminId || !payload.email) return null;
    return { adminId: payload.adminId as string, email: payload.email as string, role: (payload.role as string) ?? "admin" };
  } catch {
    return null;
  }
}

/** Server Component / Route Handler helper — reads the session from cookies(). */
export async function getSession(): Promise<AdminSession | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
