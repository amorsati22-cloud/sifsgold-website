import "server-only";

import { isProUserType } from "@/lib/auth-pro";
import { createClient } from "@/lib/supabase/server";
import { SEED_AFFIRMATIONS } from "@/lib/affirmations/seed-data";
import { pickDailyAffirmation, pickNextAffirmation, recentCutoffDate } from "@/lib/affirmations/scheduler";
import type { AffirmationAudience, DailyAffirmation, UserAffirmationHistory } from "@/types/affirmations";

export async function getAffirmationUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null, audience: "clients" as AffirmationAudience };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let audience: AffirmationAudience = "clients";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).maybeSingle();
    const t = profile?.user_type as string | undefined;
    if (t === "student") audience = "students";
    else if (isProUserType(t)) audience = "pros";
    else audience = "clients";
  }
  return { supabase, user, audience };
}

async function loadAffirmations(): Promise<DailyAffirmation[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from("daily_affirmations").select("*").eq("active", true);
    if (data?.length) return data as DailyAffirmation[];
  }
  return SEED_AFFIRMATIONS;
}

export async function getTodaysAffirmation(audience: AffirmationAudience): Promise<DailyAffirmation | null> {
  const pool = await loadAffirmations();
  return pickDailyAffirmation(pool, audience);
}

export async function getNextAffirmationForUser(
  userId: string,
  audience: AffirmationAudience,
): Promise<DailyAffirmation | null> {
  const pool = await loadAffirmations();
  const supabase = await createClient();
  const recentIds = new Set<string>();
  if (supabase) {
    const { data } = await supabase
      .from("user_affirmation_history")
      .select("affirmation_id")
      .eq("user_id", userId)
      .gte("shown_at", recentCutoffDate());
    for (const row of data ?? []) recentIds.add(row.affirmation_id as string);
  }
  return pickNextAffirmation(pool, audience, recentIds);
}

export async function getSavedAffirmations(userId: string): Promise<
  (UserAffirmationHistory & { affirmation: DailyAffirmation })[]
> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("user_affirmation_history")
    .select("*, daily_affirmations(*)")
    .eq("user_id", userId)
    .eq("saved", true)
    .order("shown_at", { ascending: false });

  return (data ?? []).map((row) => {
    const aff = (row as { daily_affirmations: DailyAffirmation }).daily_affirmations;
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      affirmation_id: row.affirmation_id as string,
      shown_at: row.shown_at as string,
      saved: true,
      shared_to_platform: row.shared_to_platform as string | null,
      affirmation: aff,
    };
  });
}

export async function getAffirmationById(id: string): Promise<DailyAffirmation | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from("daily_affirmations").select("*").eq("id", id).maybeSingle();
    if (data) return data as DailyAffirmation;
  }
  return SEED_AFFIRMATIONS.find((a) => a.id === id) ?? null;
}
