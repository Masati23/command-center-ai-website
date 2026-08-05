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

  // Powers the Customer Timeline's "Status changes" / "Follow-up notes"
  // entries and the Executive Dashboard's Recent Activity feed — only
  // written for the field(s) that actually changed, not on every save.
  const events: { type: string; metadata: Record<string, unknown> }[] = [];
  if (parsed.data.status && parsed.data.status !== existing.status) {
    events.push({ type: "status_changed", metadata: { from: existing.status, to: parsed.data.status } });
  }
  if (parsed.data.ownerNotes !== undefined && parsed.data.ownerNotes !== existing.ownerNotes) {
    events.push({ type: "note_updated", metadata: {} });
  }
  if (events.length > 0) {
    await db.eventLog.createMany({
      data: events.map((e) => ({ type: e.type, refId: existing.id, email: existing.email, metadata: e.metadata })),
    });
  }

  return NextResponse.json({ ok: true, submission: updated });
}
