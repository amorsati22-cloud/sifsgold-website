import "server-only";

import { createClient } from "@/lib/supabase/server";
import { SEED_CHALLENGES } from "@/lib/challenges/seed-data";
import type { BeautyChallenge, ChallengeCheckIn, ChallengeParticipant, ChallengeType } from "@/types/challenges-feed";

export async function listChallenges(opts?: {
  activeOnly?: boolean;
  type?: ChallengeType;
  includePast?: boolean;
}): Promise<BeautyChallenge[]> {
  const supabase = await createClient();
  if (supabase) {
    let q = supabase.from("beauty_challenges").select("*").order("start_date", { ascending: false });
    if (opts?.activeOnly !== false) q = q.eq("active", true);
    if (opts?.type) q = q.eq("challenge_type", opts.type);
    const { data } = await q;
    if (data?.length) {
      let list = data as BeautyChallenge[];
      if (!opts?.includePast) {
        const today = new Date().toISOString().slice(0, 10);
        list = list.filter((c) => c.end_date >= today || c.active);
      }
      return list;
    }
  }
  let list = [...SEED_CHALLENGES];
  if (opts?.activeOnly !== false) list = list.filter((c) => c.active);
  if (opts?.type) list = list.filter((c) => c.challenge_type === opts.type);
  if (!opts?.includePast) {
    const today = new Date().toISOString().slice(0, 10);
    list = list.filter((c) => c.end_date >= today);
  }
  return list;
}

export async function getChallenge(id: string): Promise<BeautyChallenge | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from("beauty_challenges").select("*").eq("id", id).maybeSingle();
    if (data) return data as BeautyChallenge;
  }
  return SEED_CHALLENGES.find((c) => c.id === id) ?? null;
}

export async function getUserParticipation(userId: string, challengeId: string) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("challenge_participants")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .maybeSingle();
  return (data as ChallengeParticipant) ?? null;
}

export async function getUserChallengeIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("challenge_participants").select("challenge_id").eq("user_id", userId);
  return (data ?? []).map((r) => r.challenge_id as string);
}

export async function getApprovedCheckIns(challengeId: string, limit = 12): Promise<ChallengeCheckIn[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("challenge_check_ins")
      .select("*")
      .eq("challenge_id", challengeId)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (data) return data as ChallengeCheckIn[];
  }
  return [];
}

export async function getLeaderboard(challengeId: string, limit = 10) {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("challenge_participants")
    .select("days_completed, profiles(display_name)")
    .eq("challenge_id", challengeId)
    .eq("public", true)
    .order("days_completed", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => {
    const name = (row.profiles as { display_name: string | null } | null)?.display_name ?? "Community member";
    const first = name.split(/\s+/)[0] ?? "Member";
    return { firstName: first, days: row.days_completed as number };
  });
}

export async function getUserChallenges(userId: string) {
  const supabase = await createClient();
  if (!supabase) return { active: [], completed: [] };
  const { data } = await supabase
    .from("challenge_participants")
    .select("*, beauty_challenges(*)")
    .eq("user_id", userId);
  const active: { participant: ChallengeParticipant; challenge: BeautyChallenge }[] = [];
  const completed: typeof active = [];
  for (const row of data ?? []) {
    const challenge = (row as { beauty_challenges: BeautyChallenge }).beauty_challenges;
    const participant = row as unknown as ChallengeParticipant;
    if (participant.completed_at) completed.push({ participant, challenge });
    else active.push({ participant, challenge });
  }
  return { active, completed };
}

export async function getUserCheckIns(userId: string, limit = 15) {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("challenge_check_ins")
    .select("id, day_number, caption, approved, created_at, beauty_challenges(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
