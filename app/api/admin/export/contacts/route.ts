import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submissions = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = submissions.map((s) => ({
    name: s.name,
    email: s.email,
    phone: s.phone ?? "",
    company: s.company ?? "",
    message: s.message,
    createdAt: s.createdAt.toISOString(),
  }));

  return csvResponse(toCsv(rows), "contact-submissions.csv");
}
