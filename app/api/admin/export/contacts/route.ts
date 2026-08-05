import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mirrors the exact filters available on /admin/contacts and
// /admin/consultations — "Export CSV" exports what you're currently
// looking at, not silently everything.
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status") ?? undefined;

  const submissions = await db.contactSubmission.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = submissions.map((s) => ({
    name: s.name,
    email: s.email,
    phone: s.phone ?? "",
    company: s.company ?? "",
    message: s.message,
    status: s.status,
    serviceInterest: s.serviceInterest ?? "",
    budget: s.budget ?? "",
    preferredContactMethod: s.preferredContactMethod ?? "",
    preferredContactTime: s.preferredContactTime ?? "",
    language: s.language,
    referralSource: s.referralSource ?? "",
    ownerNotes: s.ownerNotes ?? "",
    createdAt: s.createdAt.toISOString(),
  }));

  return csvResponse(toCsv(rows), "contact-submissions.csv");
}
