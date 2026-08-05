import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = ["new", "contacted", "qualified", "won", "closed"] as const;

const bodySchema = z.object({
  status: z.enum(VALID_STATUSES).optional(),
  ownerNotes: z.string().max(4000).optional(),
});

/**
 * Owner-only update for a single contact/consultation record — status
 * pipeline and private notes. Protected the same way every other /admin
 * route is: middleware.ts already blocks unauthenticated requests to
 * anything under /admin, but this is an /api route, which middleware's
 * matcher doesn't cover, so it re-checks the session directly.
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const existing = await db.contactSubmission.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.contactSubmission.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true, submission: updated });
}
