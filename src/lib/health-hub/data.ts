import "server-only";

import { createClient } from "@/lib/supabase/server";
import { decryptFields, decryptOnRead } from "@/lib/health-hub/encryption";
import { buildInsights } from "@/lib/health-hub/insights-engine";
import { isReauthValid } from "@/lib/health-hub/reauth";
import type {
  CycleLog,
  DailyPulseLog,
  HealthHubOverview,
  HealthHubSettings,
  HealthInsight,
  HydrationLog,
  MedicationEntry,
  MedicationLog,
  PreshiftRitualSession,
} from "@/types/health-hub";

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getHealthUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getHealthSettings(
  userId: string,
): Promise<HealthHubSettings | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("health_hub_settings")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as HealthHubSettings;
}

export async function requireHealthAccess(
  settings: HealthHubSettings | null,
): Promise<{ allowed: boolean; needsReauth: boolean; needsOptIn: boolean }> {
  if (!settings?.enabled) {
    return { allowed: false, needsReauth: false, needsOptIn: true };
  }
  const valid = await isReauthValid(settings.reauthenticate_after_minutes);
  if (!valid) {
    return { allowed: false, needsReauth: true, needsOptIn: false };
  }
  return { allowed: true, needsReauth: false, needsOptIn: false };
}

async function decryptPulseRows(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  rows: DailyPulseLog[],
): Promise<DailyPulseLog[]> {
  return Promise.all(
    rows.map((r) => decryptFields(supabase, r as unknown as Record<string, unknown>, ["notes"])),
  ) as unknown as Promise<DailyPulseLog[]>;
}

async function decryptCycleRows(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  rows: CycleLog[],
): Promise<CycleLog[]> {
  return Promise.all(
    rows.map((r) =>
      decryptFields(supabase, r as unknown as Record<string, unknown>, ["notes"]),
    ),
  ) as unknown as Promise<CycleLog[]>;
}

async function decryptMedRows(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  rows: MedicationEntry[],
): Promise<MedicationEntry[]> {
  return Promise.all(
    rows.map((r) =>
      decryptFields(supabase, r as unknown as Record<string, unknown>, ["notes"]),
    ),
  ) as unknown as Promise<MedicationEntry[]>;
}

async function decryptRitualRows(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  rows: PreshiftRitualSession[],
): Promise<PreshiftRitualSession[]> {
  return Promise.all(
    rows.map((r) =>
      decryptFields(supabase, r as unknown as Record<string, unknown>, ["intention"]),
    ),
  ) as unknown as Promise<PreshiftRitualSession[]>;
}

export async function getHealthHubOverview(
  userId: string,
): Promise<HealthHubOverview> {
  const supabase = await createClient();
  const empty: HealthHubOverview = {
    settings: null,
    todayPulse: null,
    todayHydrationOz: 0,
    medicationsDue: 0,
    medicationsTakenToday: 0,
    todayRitualCount: 0,
    latestRitualComplete: false,
  };
  if (!supabase) return empty;

  const settings = await getHealthSettings(userId);
  const today = startOfTodayIso();

  const [pulseRes, hydrationRes, medsRes, medLogsRes, ritualRes] = await Promise.all([
    supabase
      .from("daily_pulse_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("logged_at", today)
      .order("logged_at", { ascending: false })
      .limit(1),
    supabase
      .from("hydration_logs")
      .select("amount_oz")
      .eq("user_id", userId)
      .gte("logged_at", today),
    supabase
      .from("medication_entries")
      .select("id")
      .eq("user_id", userId)
      .eq("active", true),
    supabase
      .from("medication_logs")
      .select("id, medication_id")
      .eq("user_id", userId)
      .gte("taken_at", today)
      .eq("skipped", false),
    supabase
      .from("preshift_ritual_sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("started_at", today)
      .order("started_at", { ascending: false }),
  ]);

  let todayPulse: DailyPulseLog | null = null;
  if (pulseRes.data?.[0]) {
    const [decrypted] = await decryptPulseRows(supabase, [
      pulseRes.data[0] as DailyPulseLog,
    ]);
    todayPulse = decrypted;
  }

  const todayHydrationOz =
    (hydrationRes.data ?? []).reduce(
      (sum, row) => sum + Number((row as { amount_oz: number }).amount_oz),
      0,
    ) ?? 0;

  const activeMeds = medsRes.data?.length ?? 0;
  const takenToday = new Set(
    (medLogsRes.data ?? []).map((l) => (l as { medication_id: string }).medication_id),
  ).size;

  const rituals = (ritualRes.data ?? []) as PreshiftRitualSession[];

  return {
    settings,
    todayPulse,
    todayHydrationOz,
    medicationsDue: Math.max(0, activeMeds - takenToday),
    medicationsTakenToday: takenToday,
    todayRitualCount: rituals.length,
    latestRitualComplete: Boolean(rituals[0]?.completed_at),
  };
}

export async function getDailyPulseLogs(
  userId: string,
  days = 30,
): Promise<DailyPulseLog[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("daily_pulse_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: true });

  if (!data?.length) return [];
  return decryptPulseRows(supabase, data as DailyPulseLog[]);
}

export async function getCycleLogs(userId: string, months = 3): Promise<CycleLog[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const { data } = await supabase
    .from("cycle_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("log_date", since.toISOString().slice(0, 10))
    .order("log_date", { ascending: false });

  if (!data?.length) return [];
  return decryptCycleRows(supabase, data as CycleLog[]);
}

export async function getMedications(userId: string): Promise<MedicationEntry[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("medication_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .order("medication_name");

  if (!data?.length) return [];
  return decryptMedRows(supabase, data as MedicationEntry[]);
}

export async function getMedicationLogs(
  userId: string,
  days = 30,
): Promise<MedicationLog[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("medication_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("taken_at", since.toISOString())
    .order("taken_at", { ascending: false });

  return (data ?? []) as MedicationLog[];
}

export async function getHydrationLogs(
  userId: string,
  days = 14,
): Promise<HydrationLog[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("hydration_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: true });

  return (data ?? []) as HydrationLog[];
}

export async function getRitualSessions(
  userId: string,
  limit = 20,
): Promise<PreshiftRitualSession[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("preshift_ritual_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (!data?.length) return [];
  return decryptRitualRows(supabase, data as PreshiftRitualSession[]);
}

export async function getHealthInsights(userId: string): Promise<HealthInsight[]> {
  const settings = await getHealthSettings(userId);
  const goal = settings?.hydration_goal_oz ?? 64;

  const [pulseLogs, hydrationLogs, ritualSessions] = await Promise.all([
    getDailyPulseLogs(userId, 60),
    getHydrationLogs(userId, 30),
    getRitualSessions(userId, 30),
  ]);

  return buildInsights({ pulseLogs, hydrationLogs, ritualSessions, hydrationGoalOz: goal });
}

export async function getExportBundle(userId: string) {
  const settings = await getHealthSettings(userId);
  const [pulse, cycle, medications, medicationLogs, hydration, rituals] =
    await Promise.all([
      getDailyPulseLogs(userId, 365),
      getCycleLogs(userId, 24),
      getMedications(userId),
      getMedicationLogs(userId, 365),
      getHydrationLogs(userId, 365),
      getRitualSessions(userId, 500),
    ]);

  return { settings, pulse, cycle, medications, medicationLogs, hydration, rituals };
}
