"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveCycleLog } from "@/lib/health-hub/actions";
import {
  CYCLE_DISCLAIMER,
  FLOW_OPTIONS,
  PHASE_OPTIONS,
  SYMPTOM_OPTIONS,
} from "@/lib/health-hub/constants";
import { GlassInput } from "@/components/ui/GlassInput";
import { GoldButton } from "@/components/ui/GoldButton";
import type { CyclePhase, CycleSymptom, FlowIntensity } from "@/types/health-hub";

export function CycleSyncForm({ today }: { today: string }) {
  const router = useRouter();
  const [flow, setFlow] = useState<FlowIntensity>("none");
  const [phase, setPhase] = useState<CyclePhase | "">("");
  const [symptoms, setSymptoms] = useState<CycleSymptom[]>([]);
  const [cycleDay, setCycleDay] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const phaseTip = PHASE_OPTIONS.find((p) => p.value === phase)?.tip;

  function toggleSymptom(s: CycleSymptom) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("log_date", today);
    fd.set("flow_intensity", flow);
    if (phase) fd.set("phase", phase);
    symptoms.forEach((s) => fd.append("symptoms", s));
    const result = await saveCycleLog(fd);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6">
      <p className="font-body text-xs text-goldBody">{CYCLE_DISCLAIMER}</p>

      <input type="hidden" name="log_date" value={today} />

      <fieldset>
        <legend className="mb-2 font-body text-sm text-cream">Flow today</legend>
        <div className="flex flex-wrap gap-2">
          {FLOW_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-brand-md border px-3 py-1.5 font-body text-sm ${
                flow === opt.value ? "border-gold bg-gold/15 text-gold" : "border-white/15 text-cream/80"
              }`}
            >
              <input
                type="radio"
                name="flow_intensity"
                value={opt.value}
                checked={flow === opt.value}
                onChange={() => setFlow(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-body text-sm text-cream">Phase (optional)</legend>
        <div className="flex flex-wrap gap-2">
          {PHASE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-brand-md border px-3 py-1.5 font-body text-sm ${
                phase === opt.value ? "border-gold bg-gold/15 text-gold" : "border-white/15 text-cream/80"
              }`}
            >
              <input
                type="radio"
                name="phase"
                value={opt.value}
                checked={phase === opt.value}
                onChange={() => setPhase(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {phaseTip ? (
        <p className="rounded-brand-md border border-gold/15 bg-gold/5 p-3 font-body text-sm text-cream/85">
          {phaseTip}
        </p>
      ) : null}

      <fieldset>
        <legend className="mb-2 font-body text-sm text-cream">Symptoms (optional)</legend>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-brand-md border px-3 py-1.5 font-body text-sm ${
                symptoms.includes(opt.value)
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/15 text-cream/80"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={symptoms.includes(opt.value)}
                onChange={() => toggleSymptom(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="cycle_day" className="mb-1 block font-body text-sm text-cream">
          Cycle day (optional)
        </label>
        <GlassInput
          id="cycle_day"
          name="cycle_day"
          type="number"
          min={1}
          value={cycleDay}
          onChange={(e) => setCycleDay(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="cycle_notes" className="mb-1 block font-body text-sm text-cream">
          Notes (encrypted)
        </label>
        <textarea
          id="cycle_notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-offwhite focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/20"
        />
      </div>

      <p className="font-body text-xs text-goldBody">
        Talk to your healthcare provider for medical or contraceptive decisions.
      </p>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <GoldButton label={pending ? "Saving…" : "Save today’s log"} type="submit" variant="solid" />
    </form>
  );
}
