"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveDailyPulse } from "@/lib/health-hub/actions";
import { LevelSlider } from "@/components/health-hub/LevelSlider";
import { MoodPicker } from "@/components/health-hub/MoodPicker";
import { GlassInput } from "@/components/ui/GlassInput";
import { GoldButton } from "@/components/ui/GoldButton";
import { PHYSICAL_FEELING_OPTIONS } from "@/lib/health-hub/constants";
import type { MoodLabel, PhysicalFeeling } from "@/types/health-hub";

export function DailyPulseForm() {
  const router = useRouter();
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState<MoodLabel>("okay");
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stress, setStress] = useState(5);
  const [physical, setPhysical] = useState<PhysicalFeeling[]>([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function togglePhysical(f: PhysicalFeeling) {
    setPhysical((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("energy_level", String(energy));
    fd.set("mood_label", mood);
    fd.set("sleep_quality", String(sleepQuality));
    fd.set("stress_level", String(stress));
    physical.forEach((p) => fd.append("physical_feeling", p));
    const result = await saveDailyPulse(fd);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6">
      <MoodPicker value={mood} onChange={setMood} />
      <LevelSlider
        id="energy"
        name="energy_level"
        label="Energy"
        value={energy}
        onChange={setEnergy}
      />
      <div>
        <label htmlFor="sleep_hours" className="mb-1 block font-body text-sm text-cream">
          Sleep (hours)
        </label>
        <GlassInput
          id="sleep_hours"
          name="sleep_hours"
          type="number"
          min={0}
          max={24}
          step={0.5}
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          placeholder="7.5"
        />
      </div>
      <LevelSlider
        id="sleep_quality"
        name="sleep_quality"
        label="Sleep quality"
        value={sleepQuality}
        onChange={setSleepQuality}
      />
      <LevelSlider id="stress" name="stress_level" label="Stress" value={stress} onChange={setStress} />

      <fieldset>
        <legend className="mb-2 font-body text-sm text-cream">Physical feeling (optional)</legend>
        <div className="flex flex-wrap gap-2">
          {PHYSICAL_FEELING_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-brand-md border px-3 py-1.5 font-body text-sm ${
                physical.includes(opt.value)
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/15 text-cream/80"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={physical.includes(opt.value)}
                onChange={() => togglePhysical(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="notes" className="mb-1 block font-body text-sm text-cream">
          Notes (encrypted at rest)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-offwhite placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/20"
        />
      </div>

      <p className="font-body text-xs text-goldBody">
        Talk to your healthcare provider for medical decisions. This is wellness tracking only.
      </p>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <GoldButton label={pending ? "Saving…" : "Save today’s pulse"} type="submit" variant="solid" />
    </form>
  );
}
