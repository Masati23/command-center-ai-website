"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment-config";
import { FieldRenderer } from "./FieldRenderer";
import { GlassCard, Button } from "@/components/ui";

const DRAFT_ID_KEY = "cc_assessment_draft_id";

type SectionAnswers = Record<string, any>;
type AllAnswers = Record<string, SectionAnswers>;

export default function AssessmentWizard() {
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<AllAnswers>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const section = ASSESSMENT_SECTIONS[sectionIndex];
  const totalSections = ASSESSMENT_SECTIONS.length;
  const progressPct = Math.round(((sectionIndex + 1) / totalSections) * 100);

  // Resume an existing draft (localStorage-tracked id) or start a new one.
  useEffect(() => {
    async function init() {
      const existingId = typeof window !== "undefined" ? localStorage.getItem(DRAFT_ID_KEY) : null;
      try {
        if (existingId) {
          const res = await fetch(`/api/assessment/${existingId}`);
          if (res.ok) {
            const data = await res.json();
            setAssessmentId(data.id);
            setAnswers(data.answers ?? {});
            setSectionIndex(Math.max(0, Math.min((data.currentSection ?? 1) - 1, totalSections - 1)));
            setLoaded(true);
            return;
          }
        }
        const res = await fetch("/api/assessment", { method: "POST" });
        const data = await res.json();
        setAssessmentId(data.id);
        if (typeof window !== "undefined") localStorage.setItem(DRAFT_ID_KEY, data.id);
      } catch {
        // Non-fatal — the wizard still works locally; it just won't autosave
        // until a subsequent save attempt succeeds.
      } finally {
        setLoaded(true);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentSectionAnswers = answers[section.key] ?? {};

  function updateField(name: string, value: any) {
    setAnswers((prev) => ({
      ...prev,
      [section.key]: { ...prev[section.key], [name]: value },
    }));
    scheduleSave();
  }

  function scheduleSave() {
    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(), 800);
  }

  async function save(overrideSectionIndex?: number) {
    if (!assessmentId) return;
    try {
      await fetch(`/api/assessment/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          currentSection: (overrideSectionIndex ?? sectionIndex) + 1,
        }),
      });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  function isSectionValid(): boolean {
    for (const field of section.fields) {
      if (field.dependsOn) {
        const dependsValue = currentSectionAnswers[field.dependsOn];
        if (dependsValue !== field.equals) continue; // conditional field not active, skip requirement
      }
      if (!field.required) continue;
      const v = currentSectionAnswers[field.name];
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
        return false;
      }
    }
    return true;
  }

  async function handleBack() {
    if (sectionIndex === 0) return;
    setSectionIndex((i) => i - 1);
  }

  async function handleContinue() {
    if (!isSectionValid()) return;
    if (sectionIndex < totalSections - 1) {
      const next = sectionIndex + 1;
      await save(next);
      setSectionIndex(next);
    } else {
      await handleSubmit();
    }
  }

  async function handleSubmit() {
    if (!assessmentId || !isSectionValid()) return;
    setSubmitting(true);
    try {
      await save();
      const res = await fetch(`/api/assessment/${assessmentId}/submit`, { method: "POST" });
      if (res.ok) {
        if (typeof window !== "undefined") localStorage.removeItem(DRAFT_ID_KEY);
        router.push(`/assessment/results/${assessmentId}`);
        return;
      }
    } finally {
      setSubmitting(false);
    }
  }

  const visibleFields = useMemo(
    () =>
      section.fields.filter((f) => {
        if (!f.dependsOn) return true;
        return currentSectionAnswers[f.dependsOn] === f.equals;
      }),
    [section, currentSectionAnswers]
  );

  if (!loaded) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-32">
        <p className="text-silver-400">Loading your assessment…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-silver-500">
          <span>
            Step {sectionIndex + 1} of {totalSections}
          </span>
          <span>{saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Progress saved" : ""}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-electric-500 to-electric-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <GlassCard className="p-8">
        <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
        <p className="mt-1.5 text-sm text-silver-400">{section.description}</p>

        <div className="mt-8 space-y-6">
          {visibleFields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={currentSectionAnswers[field.name]}
              onChange={updateField}
            />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} className={sectionIndex === 0 ? "pointer-events-none opacity-0" : ""}>
            Back
          </Button>
          <Button variant="primary" onClick={handleContinue} className={!isSectionValid() ? "pointer-events-none opacity-50" : ""}>
            {submitting
              ? "Submitting…"
              : sectionIndex === totalSections - 1
                ? "Get My Results"
                : "Continue"}
          </Button>
        </div>
      </GlassCard>

      <p className="mt-6 text-center text-xs text-silver-500">
        Takes about 5–8 minutes. Your answers are private and used only to prepare your recommendation — see our
        privacy notice below.
      </p>
    </div>
  );
}
