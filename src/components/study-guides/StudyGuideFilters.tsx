"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PROGRAM_TYPE_LABELS } from "@/lib/study-guides/constants";
import type { ProgramType } from "@/types/study-guides";

const PROGRAMS = Object.keys(PROGRAM_TYPE_LABELS) as ProgramType[];

const STATES = [
  { code: "", label: "All states" },
  { code: "TX", label: "Texas" },
  { code: "CA", label: "California" },
  { code: "FL", label: "Florida" },
  { code: "NY", label: "New York" },
  { code: "PA", label: "Pennsylvania" },
];

export function StudyGuideFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const program = params.get("program") ?? "";
  const state = params.get("state") ?? "";

  function update(key: "program" | "state", value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const q = next.toString();
    router.push(q ? `/study-guides?${q}` : "/study-guides");
  }

  return (
    <div className="flex flex-wrap gap-4">
      <label className="flex flex-col gap-1 text-xs text-cream/70">
        Program
        <select
          value={program}
          onChange={(e) => update("program", e.target.value)}
          className="rounded-brand border border-gold/30 bg-navy-deep px-3 py-2 text-sm text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          <option value="">All programs</option>
          {PROGRAMS.map((p) => (
            <option key={p} value={p}>
              {PROGRAM_TYPE_LABELS[p]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-cream/70">
        State
        <select
          value={state}
          onChange={(e) => update("state", e.target.value)}
          className="rounded-brand border border-gold/30 bg-navy-deep px-3 py-2 text-sm text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          {STATES.map((s) => (
            <option key={s.code || "all"} value={s.code}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
