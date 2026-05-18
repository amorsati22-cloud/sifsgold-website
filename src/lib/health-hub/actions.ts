"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildHealthExportCsv } from "@/lib/health-hub/export";
import { encryptOnWrite } from "@/lib/health-hub/encryption";
import { getExportBundle, getHealthUser } from "@/lib/health-hub/data";
import {
  HYDRATION_GOAL_DEFAULT,
  HYDRATION_GOAL_MAX,
  HYDRATION_GOAL_MIN,
} from "@/lib/health-hub/constants";
import { clearReauthCookie, setReauthCookie } from "@/lib/health-hub/reauth";
import { createClient } from "@/lib/supabase/server";
import type {
  BeverageType,
  CyclePhase,
  CycleSymptom,
  FlowIntensity,
  MedicationFrequency,
  MedicationPurpose,
  MoodLabel,
  PhysicalFeeling,
  RitualStep,
} from "@/types/health-hub";

const HEALTH_PATHS = [
  "/dashboard/health-hub",
  "/dashboard/health-hub/daily-pulse",
  "/dashboard/health-hub/cycle-sync",
  "/dashboard/health-hub/medications",
  "/dashboard/health-hub/hydration",
  "/dashboard/health-hub/pre-shift",
  "/dashboard/health-hub/insights",
  "/dashboard/health-hub/settings",
];

function revalidateHealthHub() {
  for (const p of HEALTH_PATHS) {
    revalidatePath(p);
  }
}

async function requireUser() {
  const { supabase, user } = await getHealthUser();
  if (!supabase || !user) {
    redirect("/sign-in?next=/dashboard/health-hub");
  }
  return { supabase, userId: user.id, email: user.email ?? "" };
}

export async function optInHealthHub() {
  const { supabase, userId } = await requireUser();

  const { error } = await supabase.from("health_hub_settings").upsert(
    {
      id: userId,
      enabled: true,
      daily_pulse_enabled: true,
      hydration_tracker_enabled: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) return { ok: false as const, error: error.message };
  await setReauthCookie();
  revalidateHealthHub();
  return { ok: true as const };
}

export async function updateHealthSettings(formData: FormData) {
  const { supabase, userId } = await requireUser();

  const hydrationGoal = Math.min(
    HYDRATION_GOAL_MAX,
    Math.max(
      HYDRATION_GOAL_MIN,
      Number(formData.get("hydration_goal_oz")) || HYDRATION_GOAL_DEFAULT,
    ),
  );

  const reauthMinutes = Number(formData.get("reauthenticate_after_minutes")) || 5;
  const validReauth = [1, 5, 15, 60].includes(reauthMinutes)
    ? reauthMinutes
    : 5;

  const { error } = await supabase
    .from("health_hub_settings")
    .update({
      daily_pulse_enabled: formData.get("daily_pulse_enabled") === "on",
      cycle_sync_enabled: formData.get("cycle_sync_enabled") === "on",
      medication_tracker_enabled: formData.get("medication_tracker_enabled") === "on",
      hydration_tracker_enabled: formData.get("hydration_tracker_enabled") === "on",
      preshift_ritual_enabled: formData.get("preshift_ritual_enabled") === "on",
      hydration_goal_oz: hydrationGoal,
      reauthenticate_after_minutes: validReauth,
      data_retention_days: Number(formData.get("data_retention_days")) || 365,
      export_format: formData.get("export_format") === "json" ? "json" : "csv",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) return { ok: false as const, error: error.message };
  revalidateHealthHub();
  return { ok: true as const };
}

export async function verifyHealthReauth(password: string) {
  const { supabase, email } = await requireUser();
  if (!email) return { ok: false as const, error: "No email on account." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false as const, error: "Password incorrect. Try again." };

  await setReauthCookie();
  revalidateHealthHub();
  return { ok: true as const };
}

export async function signOutHealthReauth() {
  await clearReauthCookie();
  revalidateHealthHub();
}

export async function saveDailyPulse(formData: FormData) {
  const { supabase, userId } = await requireUser();

  const notesPlain = String(formData.get("notes") ?? "");
  const notes = await encryptOnWrite(supabase, notesPlain);

  const physicalRaw = formData.getAll("physical_feeling").map(String);
  const physical_feeling = physicalRaw as PhysicalFeeling[];

  const { error } = await supabase.from("daily_pulse_logs").insert({
    user_id: userId,
    energy_level: Number(formData.get("energy_level")) || 5,
    mood_label: (formData.get("mood_label") as MoodLabel) || "okay",
    sleep_hours: formData.get("sleep_hours")
      ? Number(formData.get("sleep_hours"))
      : null,
    sleep_quality: formData.get("sleep_quality")
      ? Number(formData.get("sleep_quality"))
      : null,
    stress_level: formData.get("stress_level")
      ? Number(formData.get("stress_level"))
      : null,
    physical_feeling,
    notes,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidateHealthHub();
  return { ok: true as const };
}

export async function saveCycleLog(formData: FormData) {
  const { supabase, userId } = await requireUser();

  const logDate = String(formData.get("log_date") || new Date().toISOString().slice(0, 10));
  const notes = await encryptOnWrite(supabase, String(formData.get("notes") ?? ""));
  const symptoms = formData.getAll("symptoms").map(String) as CycleSymptom[];

  const { error } = await supabase.from("cycle_logs").upsert(
    {
      user_id: userId,
      log_date: logDate,
      flow_intensity: (formData.get("flow_intensity") as FlowIntensity) || "none",
      symptoms,
      cycle_day: formData.get("cycle_day") ? Number(formData.get("cycle_day")) : null,
      phase: (formData.get("phase") as CyclePhase) || null,
      notes,
    },
    { onConflict: "user_id,log_date" },
  );

  if (error) return { ok: false as const, error: error.message };
  revalidateHealthHub();
  return { ok: true as const };
}

export async function addMedication(formData: FormData) {
  const { supabase, userId } = await requireUser();

  const notes = await encryptOnWrite(supabase, String(formData.get("notes") ?? ""));

  const { error } = await supabase.from("medication_entries").insert({
    user_id: userId,
    medication_name: String(formData.get("medication_name") ?? "").trim(),
    dosage: String(formData.get("dosage") ?? "") || null,
    frequency: (formData.get("frequency") as MedicationFrequency) || null,
    purpose_category: (formData.get("purpose_category") as MedicationPurpose) || null,
    reminders_enabled: formData.get("reminders_enabled") === "on",
    notes,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidateHealthHub();
  return { ok: true as const };
}

export async function logMedicationTaken(medicationId: string, skipped = false) {
  const { supabase, userId } = await requireUser();

  const { error } = await supabase.from("medication_logs").insert({
    medication_id: medicationId,
    user_id: userId,
    skipped,
    skip_reason: skipped ? "user_skipped" : null,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidateHealthHub();
  return { ok: true as const };
}

export async function logHydration(amountOz: number, beverageType: BeverageType = "water") {
  const { supabase, userId } = await requireUser();

  const oz = Math.min(128, Math.max(0.5, amountOz));
  const { error } = await supabase.from("hydration_logs").insert({
    user_id: userId,
    amount_oz: oz,
    beverage_type: beverageType,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidateHealthHub();
  return { ok: true as const };
}

export async function startRitualSession(moodBefore: number) {
  const { supabase, userId } = await requireUser();

  const { data, error } = await supabase
    .from("preshift_ritual_sessions")
    .insert({ user_id: userId, mood_before: moodBefore })
    .select("id")
    .single();

  if (error || !data) return { ok: false as const, error: error?.message ?? "Failed" };
  revalidateHealthHub();
  return { ok: true as const, sessionId: data.id as string };
}

export async function updateRitualSession(
  sessionId: string,
  payload: {
    stepsCompleted: RitualStep[];
    moodAfter?: number;
    intention?: string;
    complete?: boolean;
    durationSeconds?: number;
  },
) {
  const { supabase, userId } = await requireUser();

  const intentionCipher = payload.intention
    ? await encryptOnWrite(supabase, payload.intention)
    : undefined;

  const update: Record<string, unknown> = {
    steps_completed: payload.stepsCompleted,
  };
  if (intentionCipher !== undefined) update.intention = intentionCipher;
  if (payload.moodAfter != null) update.mood_after = payload.moodAfter;
  if (payload.complete) {
    update.completed_at = new Date().toISOString();
    update.duration_seconds = payload.durationSeconds ?? null;
  }

  const { error } = await supabase
    .from("preshift_ritual_sessions")
    .update(update)
    .eq("id", sessionId)
    .eq("user_id", userId);

  if (error) return { ok: false as const, error: error.message };
  revalidateHealthHub();
  return { ok: true as const };
}

export async function exportHealthData(): Promise<{ ok: true; csv: string } | { ok: false; error: string }> {
  const { userId } = await requireUser();
  const bundle = await getExportBundle(userId);
  const csv = buildHealthExportCsv(bundle);
  return { ok: true, csv };
}

export async function deleteAllHealthData(confirmation: string) {
  if (confirmation !== "DELETE") {
    return { ok: false as const, error: 'Type DELETE to confirm permanent deletion.' };
  }

  const { supabase, userId } = await requireUser();

  const tables = [
    "daily_pulse_logs",
    "cycle_logs",
    "medication_logs",
    "medication_entries",
    "hydration_logs",
    "preshift_ritual_sessions",
  ] as const;

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("user_id", userId);
    if (error) return { ok: false as const, error: error.message };
  }

  await supabase
    .from("health_hub_settings")
    .update({
      enabled: false,
      daily_pulse_enabled: false,
      cycle_sync_enabled: false,
      medication_tracker_enabled: false,
      hydration_tracker_enabled: false,
      preshift_ritual_enabled: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  await clearReauthCookie();
  revalidateHealthHub();
  return { ok: true as const };
}
