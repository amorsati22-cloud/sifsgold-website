"use client";

import type { MoodLabel } from "@/types/health-hub";
import { MOOD_OPTIONS } from "@/lib/health-hub/constants";

export function MoodPicker({
  value,
  onChange,
}: {
  value: MoodLabel;
  onChange: (m: MoodLabel) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-body text-sm text-cream">How are you feeling?</legend>
      <div className="flex flex-wrap gap-2">
        {MOOD_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-brand-md border px-3 py-2 font-body text-sm transition focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-navy ${
                selected
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/15 text-cream/80 hover:border-gold/40"
              }`}
            >
              <input
                type="radio"
                name="mood_label"
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span aria-hidden>{opt.emoji}</span> {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
