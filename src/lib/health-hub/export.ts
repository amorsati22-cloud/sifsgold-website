import "server-only";

import type {
  CycleLog,
  DailyPulseLog,
  HealthHubSettings,
  HydrationLog,
  MedicationEntry,
  MedicationLog,
  PreshiftRitualSession,
} from "@/types/health-hub";

function escapeCsv(value: unknown): string {
  if (value == null) return "";
  const s = Array.isArray(value) ? value.join(";") : String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCsv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ];
  return lines.join("\n");
}

export function buildHealthExportCsv(data: {
  settings: HealthHubSettings | null;
  pulse: DailyPulseLog[];
  cycle: CycleLog[];
  medications: MedicationEntry[];
  medicationLogs: MedicationLog[];
  hydration: HydrationLog[];
  rituals: PreshiftRitualSession[];
}): string {
  const sections: string[] = [];

  sections.push("# Health Hub Export — Sif's Gold");
  sections.push(`# Generated: ${new Date().toISOString()}`);
  sections.push("");

  if (data.settings) {
    sections.push("## Settings");
    sections.push(
      rowsToCsv(
        ["enabled", "daily_pulse", "cycle_sync", "medications", "hydration", "preshift_ritual", "hydration_goal_oz"],
        [
          [
            data.settings.enabled,
            data.settings.daily_pulse_enabled,
            data.settings.cycle_sync_enabled,
            data.settings.medication_tracker_enabled,
            data.settings.hydration_tracker_enabled,
            data.settings.preshift_ritual_enabled,
            data.settings.hydration_goal_oz,
          ],
        ],
      ),
    );
    sections.push("");
  }

  sections.push("## Daily Pulse");
  sections.push(
    rowsToCsv(
      ["logged_at", "energy", "mood", "sleep_hours", "sleep_quality", "stress", "physical_feeling", "notes"],
      data.pulse.map((p) => [
        p.logged_at,
        p.energy_level,
        p.mood_label,
        p.sleep_hours,
        p.sleep_quality,
        p.stress_level,
        p.physical_feeling,
        p.notes,
      ]),
    ),
  );
  sections.push("");

  sections.push("## Cycle");
  sections.push(
    rowsToCsv(
      ["log_date", "flow", "symptoms", "cycle_day", "phase", "notes"],
      data.cycle.map((c) => [
        c.log_date,
        c.flow_intensity,
        c.symptoms,
        c.cycle_day,
        c.phase,
        c.notes,
      ]),
    ),
  );
  sections.push("");

  sections.push("## Medications");
  sections.push(
    rowsToCsv(
      ["name", "dosage", "frequency", "purpose", "start", "end", "notes"],
      data.medications.map((m) => [
        m.medication_name,
        m.dosage,
        m.frequency,
        m.purpose_category,
        m.start_date,
        m.end_date,
        m.notes,
      ]),
    ),
  );
  sections.push("");

  sections.push("## Medication Logs");
  sections.push(
    rowsToCsv(["medication_id", "taken_at", "skipped", "skip_reason"], data.medicationLogs.map((l) => [
      l.medication_id,
      l.taken_at,
      l.skipped,
      l.skip_reason,
    ])),
  );
  sections.push("");

  sections.push("## Hydration");
  sections.push(
    rowsToCsv(["logged_at", "amount_oz", "beverage_type"], data.hydration.map((h) => [
      h.logged_at,
      h.amount_oz,
      h.beverage_type,
    ])),
  );
  sections.push("");

  sections.push("## Pre-shift Rituals");
  sections.push(
    rowsToCsv(
      ["started_at", "completed_at", "duration_seconds", "steps", "mood_before", "mood_after", "intention"],
      data.rituals.map((r) => [
        r.started_at,
        r.completed_at,
        r.duration_seconds,
        r.steps_completed,
        r.mood_before,
        r.mood_after,
        r.intention,
      ]),
    ),
  );

  return sections.join("\n");
}
