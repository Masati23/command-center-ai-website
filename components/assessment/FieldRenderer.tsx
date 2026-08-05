"use client";

import React from "react";
import type { AssessmentField } from "@/lib/assessment-config";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-silver-500 outline-none transition-colors focus:border-electric-500/50";

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: AssessmentField;
  value: any;
  onChange: (name: string, value: any) => void;
}) {
  const label = (
    <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-silver-300">
      {field.label}
      {field.required && <span className="ml-1 text-electric-400">*</span>}
    </label>
  );

  const help = field.helpText && <p className="mt-1.5 text-xs text-silver-500">{field.helpText}</p>;

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
    case "url":
    case "number":
      return (
        <div>
          {label}
          <input
            id={field.name}
            type={field.type}
            required={field.required}
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)}
            className={inputClass}
          />
          {help}
        </div>
      );

    case "textarea":
      return (
        <div>
          {label}
          <textarea
            id={field.name}
            required={field.required}
            value={value ?? ""}
            rows={4}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`${inputClass} resize-none`}
          />
          {help}
        </div>
      );

    case "select":
      return (
        <div>
          {label}
          <select
            id={field.name}
            required={field.required}
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );

    case "radio":
      return (
        <div>
          {label}
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {field.options?.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => onChange(field.name, opt.value)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  value === opt.value
                    ? "border-electric-500/60 bg-electric-500/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-silver-300 hover:border-white/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {help}
        </div>
      );

    case "boolean":
      return (
        <div>
          {label}
          <div className="mt-2 flex gap-2">
            {(field.options ?? [
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]).map((opt) => {
              const boolVal = opt.value === "true";
              const selected = value === boolVal;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => onChange(field.name, boolVal)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    selected
                      ? "border-electric-500/60 bg-electric-500/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-silver-300 hover:border-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {help}
        </div>
      );

    case "checkboxGroup": {
      const selected: string[] = Array.isArray(value) ? value : [];
      const toggle = (v: string) => {
        const next = selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v];
        onChange(field.name, next);
      };
      return (
        <div>
          {label}
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {field.options?.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  selected.includes(opt.value)
                    ? "border-electric-500/60 bg-electric-500/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-silver-300 hover:border-white/20"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    selected.includes(opt.value) ? "border-electric-400 bg-electric-500" : "border-white/20"
                  }`}
                >
                  {selected.includes(opt.value) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
          {help}
        </div>
      );
    }

    default:
      return null;
  }
}
