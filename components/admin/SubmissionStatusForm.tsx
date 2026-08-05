"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { STATUS_OPTIONS } from "./StatusBadge";

export default function SubmissionStatusForm({
  id,
  initialStatus,
  initialNotes,
}: {
  id: string;
  initialStatus: string;
  initialNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ownerNotes: notes }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-silver-400">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-electric-500/50"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-navy-900">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-silver-400">Private notes (owner only)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Not visible to the customer…"
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none focus:border-electric-500/50"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="primary" onClick={handleSave} className="!px-5 !py-2.5">
          {saving ? "Saving…" : "Save"}
        </Button>
        {saved && <span className="text-xs text-electric-400">Saved.</span>}
      </div>
    </div>
  );
}
