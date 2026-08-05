/**
 * In-memory rate limiting, per server instance. Same honest caveat as the
 * admin login limiter: Vercel serverless functions are stateless across
 * invocations/regions, so this slows down casual abuse from a single
 * warm instance but is not a complete defense against a determined or
 * distributed attacker. Pair with a real rate-limit service (e.g. Upstash
 * Redis, or Vercel's own Attack Challenge Mode) before this handles
 * meaningful public traffic.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > maxAttempts;
}

export function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
