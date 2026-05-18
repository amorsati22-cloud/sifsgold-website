"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { addMedication, logMedicationTaken } from "@/lib/health-hub/actions";
import {
  FREQUENCY_OPTIONS,
  MEDICATION_DISCLAIMER,
  PURPOSE_OPTIONS,
} from "@/lib/health-hub/constants";
import { GlassInput } from "@/components/ui/GlassInput";
import { GoldButton } from "@/components/ui/GoldButton";
import type { MedicationEntry, MedicationLog } from "@/types/health-hub";

function buildAdherenceChart(logs: MedicationLog[], medications: MedicationEntry[]) {
  const byDay = new Map<string, { taken: number; total: number }>();
  const medCount = medications.length || 1;

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, { taken: 0, total: medCount });
  }

  for (const log of logs) {
    if (log.skipped) continue;
    const day = log.taken_at.slice(0, 10);
    const row = byDay.get(day);
    if (row) row.taken += 1;
  }

  return [...byDay.entries()].map(([date, v]) => ({
    date: date.slice(5),
    pct: Math.min(100, Math.round((v.taken / v.total) * 100)),
  }));
}

export function MedicationsPanel({
  medications,
  logs,
}: {
  medications: MedicationEntry[];
  logs: MedicationLog[];
}) {
  const theme = useTheme();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartData = buildAdherenceChart(logs, medications);

  const takenToday = new Set(
    logs
      .filter((l) => !l.skipped && l.taken_at.slice(0, 10) === new Date().toISOString().slice(0, 10))
      .map((l) => l.medication_id),
  );

  async function handleTake(id: string) {
    const result = await logMedicationTaken(id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const result = await addMedication(new FormData(e.currentTarget));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <p className="font-body text-xs text-goldBody">{MEDICATION_DISCLAIMER}</p>
      <p className="font-body text-sm text-cream/75">
        We track that you took a medication — descriptive labels only, not medical advice.
      </p>

      <ul className="space-y-3">
        {medications.map((med) => (
          <li
            key={med.id}
            className="flex flex-col gap-3 rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-heading text-gold">{med.medication_name}</p>
              {med.dosage ? (
                <p className="font-body text-xs text-cream/60">{med.dosage} (descriptive)</p>
              ) : null}
            </div>
            <GoldButton
              label={takenToday.has(med.id) ? "Logged today" : "Take now"}
              variant={takenToday.has(med.id) ? "outlined" : "solid"}
              onClick={() => !takenToday.has(med.id) && handleTake(med.id)}
            />
          </li>
        ))}
      </ul>

      {medications.length === 0 ? (
        <p className="font-body text-sm text-cream/70">No medications tracked yet.</p>
      ) : null}

      <GoldButton
        label={showForm ? "Cancel" : "Add medication"}
        variant="outlined"
        onClick={() => setShowForm((s) => !s)}
      />

      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-4 rounded-brand-lg border border-gold/15 p-6">
          <GlassInput name="medication_name" placeholder="Medication name" required />
          <GlassInput name="dosage" placeholder="Dosage label (e.g. 20mg) — descriptive only" />
          <select
            name="frequency"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-cream"
            defaultValue="daily"
          >
            {FREQUENCY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            name="purpose_category"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-cream"
          >
            {PURPOSE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <GoldButton label="Save medication" type="submit" variant="solid" />
        </form>
      ) : null}

      <section aria-labelledby="adherence-heading">
        <h2 id="adherence-heading" className="font-heading text-lg text-gold">
          Adherence (30 days)
        </h2>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke={theme.colors.goldBody} strokeOpacity={0.15} />
              <XAxis dataKey="date" tick={{ fill: theme.colors.cream, fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: theme.colors.cream, fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.navyDeep,
                  border: `1px solid ${theme.colors.gold}`,
                }}
              />
              <Bar dataKey="pct" name="% logged" fill={theme.colors.gold} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
