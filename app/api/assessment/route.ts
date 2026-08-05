import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// Creates a new draft assessment. Called once when a visitor lands on
// /assessment without a saved draft ID in localStorage.
export async function POST() {
  try {
    const assessment = await db.assessment.create({
      data: { status: "DRAFT", currentSection: 1 },
    });

    await db.eventLog.create({
      data: { type: "assessment_started", refId: assessment.id },
    });

    return NextResponse.json({ id: assessment.id });
  } catch (err) {
    console.error("Failed to create assessment draft:", err);
    return NextResponse.json({ error: "Could not start assessment." }, { status: 500 });
  }
}
