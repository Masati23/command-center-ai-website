import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment-config";
import { resumeAssessment } from "@/lib/assessment-lifecycle";

export const runtime = "nodejs";

const patchSchema = z.object({
  answers: z.record(z.string(), z.record(z.string(), z.any())),
  currentSection: z.number().int().min(1).max(ASSESSMENT_SECTIONS.length),
});

function sectionColumns(answers: Record<string, any>) {
  // Maps the client's { sectionKey: {...} } shape onto the individual JSON
  // columns Prisma expects (one column per section — see schema.prisma).
  const cols: Record<string, any> = {};
  for (const section of ASSESSMENT_SECTIONS) {
    if (answers[section.key] !== undefined) cols[section.key] = answers[section.key];
  }
  return cols;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  let assessment = await db.assessment.findUnique({ where: { id: params.id } });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // A visitor returning to a draft that went stale enough to be marked
  // abandoned by the cron job should transparently pick back up — their
  // localStorage draft ID is still valid, so this is a normal "welcome
  // back," not an error state.
  if (assessment.status === "ABANDONED") {
    assessment = (await resumeAssessment(assessment.id)) ?? assessment;
  }

  const answers: Record<string, any> = {};
  for (const section of ASSESSMENT_SECTIONS) {
    const val = (assessment as any)[section.key];
    if (val) answers[section.key] = val;
  }

  return NextResponse.json({
    id: assessment.id,
    status: assessment.status,
    currentSection: assessment.currentSection,
    answers,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const assessment = await db.assessment.findUnique({ where: { id: params.id } });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (assessment.status === "SUBMITTED") {
    return NextResponse.json({ error: "Assessment already submitted" }, { status: 409 });
  }

  await db.assessment.update({
    where: { id: params.id },
    data: {
      ...sectionColumns(parsed.data.answers),
      currentSection: parsed.data.currentSection,
    },
  });

  return NextResponse.json({ ok: true });
}
