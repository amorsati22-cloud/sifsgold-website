"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteAllHealthData,
  exportHealthData,
  updateHealthSettings,
} from "@/lib/health-hub/actions";
import {
  HYDRATION_GOAL_DEFAULT,
  HYDRATION_GOAL_MAX,
  HYDRATION_GOAL_MIN,
  REAUTH_INTERVALS,
} from "@/lib/health-hub/constants";
import { GlassInput } from "@/components/ui/GlassInput";
import { GoldButton } from "@/components/ui/GoldButton";
import type { HealthHubSettings } from "@/types/health-hub";

export function HealthHubSettingsForm({ settings }: { settings: HealthHubSettings }) {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const result = await updateHealthSettings(new FormData(e.currentTarget));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Settings saved.");
    router.refresh();
  }

  async function handleExport() {
    setError(null);
    const result = await exportHealthData();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sifs-gold-health-hub-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Export downloaded.");
  }

  async function handleDelete() {
    setError(null);
    const result = await deleteAllHealthData(deleteConfirm);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/dashboard/health-hub");
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSettings} className="space-y-6 rounded-brand-lg border border-gold/15 p-6">
        <h2 className="font-heading text-lg text-gold">Trackers</h2>
        {(
          [
            ["daily_pulse_enabled", "Daily Pulse"],
            ["cycle_sync_enabled", "Cycle Sync"],
            ["medication_tracker_enabled", "Medication Tracker"],
            ["hydration_tracker_enabled", "Hydration Tracker"],
            ["preshift_ritual_enabled", "Pre-shift Ritual"],
          ] as const
        ).map(([name, label]) => (
          <label key={name} className="flex items-center gap-3 font-body text-sm text-cream">
            <input
              type="checkbox"
              name={name}
              defaultChecked={settings[name]}
              className="h-4 w-4 rounded border-gold/40 accent-gold"
            />
            {label}
          </label>
        ))}

        <div>
          <label htmlFor="hydration_goal_oz" className="mb-1 block font-body text-sm text-cream">
            Hydration goal (oz/day, {HYDRATION_GOAL_MIN}–{HYDRATION_GOAL_MAX})
          </label>
          <GlassInput
            id="hydration_goal_oz"
            name="hydration_goal_oz"
            type="number"
            min={HYDRATION_GOAL_MIN}
            max={HYDRATION_GOAL_MAX}
            defaultValue={settings.hydration_goal_oz ?? HYDRATION_GOAL_DEFAULT}
          />
        </div>

        <div>
          <label htmlFor="reauthenticate_after_minutes" className="mb-1 block font-body text-sm text-cream">
            Re-authentication interval
          </label>
          <select
            id="reauthenticate_after_minutes"
            name="reauthenticate_after_minutes"
            defaultValue={settings.reauthenticate_after_minutes}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-cream"
          >
            {REAUTH_INTERVALS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <GoldButton label="Save settings" type="submit" variant="solid" />
      </form>

      <section className="rounded-brand-lg border border-gold/15 p-6">
        <h2 className="font-heading text-lg text-gold">Export data</h2>
        <p className="mt-2 font-body text-sm text-cream/75">
          Download all your Health Hub entries as CSV. Data is decrypted for export to your device only.
        </p>
        <GoldButton label="Download CSV" variant="outlined" className="mt-4" onClick={handleExport} />
      </section>

      <section className="rounded-brand-lg border border-red-400/30 p-6">
        <h2 className="font-heading text-lg text-red-300">Delete all Health Hub data</h2>
        <p className="mt-2 font-body text-sm text-cream/75">
          Permanent deletion. Type DELETE to confirm.
        </p>
        <GlassInput
          className="mt-4"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="DELETE"
          aria-label="Type DELETE to confirm"
        />
        <GoldButton
          label="Permanently delete"
          variant="outlined"
          className="mt-4 border-red-400/50 text-red-300"
          onClick={handleDelete}
        />
      </section>

      {message ? (
        <p className="font-body text-sm text-teal" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="font-body text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
