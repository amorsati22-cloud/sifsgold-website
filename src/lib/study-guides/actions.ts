"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { calculateNextReview, gradeToQuality } from "@/lib/study-guides/spaced-repetition";
import type { StudyGrade, UserCardProgress } from "@/types/study-guides";

function todayUtcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayUtcDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function updateStreak(userId: string, sessionMinutes: number) {
  const supabase = await createClient();
  if (!supabase) return;

  const today = todayUtcDate();
  const { data: existing } = await supabase
    .from("user_study_streaks")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("user_study_streaks").insert({
      id: userId,
      current_streak_days: 1,
      longest_streak_days: 1,
      last_study_date: today,
      total_study_minutes: sessionMinutes,
    });
    return;
  }

  const last = existing.last_study_date as string | null;
  let current = existing.current_streak_days as number;
  let longest = existing.longest_streak_days as number;

  if (last === today) {
    // same day — only add minutes
  } else if (last === yesterdayUtcDate()) {
    current += 1;
    longest = Math.max(longest, current);
  } else {
    current = 1;
  }

  await supabase
    .from("user_study_streaks")
    .update({
      current_streak_days: current,
      longest_streak_days: longest,
      last_study_date: today,
      total_study_minutes: (existing.total_study_minutes as number) + sessionMinutes,
    })
    .eq("id", userId);
}

export async function startStudySession(deckId: string): Promise<
  | { ok: true; sessionId: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Study guides unavailable." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to study." };

  const { data, error } = await supabase
    .from("study_sessions")
    .insert({ user_id: user.id, deck_id: deckId })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Could not start session." };
  return { ok: true, sessionId: data.id as string };
}

export async function gradeCard(input: {
  cardId: string;
  deckId: string;
  sessionId: string;
  grade: StudyGrade;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Unavailable" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const quality = gradeToQuality(input.grade);
  const isCorrect = quality >= 3;

  const { data: existing } = await supabase
    .from("user_card_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("card_id", input.cardId)
    .maybeSingle();

  const prev = existing as UserCardProgress | null;
  const reviewCountBefore = prev?.review_count ?? 0;
  const schedule = calculateNextReview(
    prev?.easiness_factor ?? 2.5,
    prev?.interval_days ?? 1,
    reviewCountBefore,
    quality,
  );

  const payload = {
    user_id: user.id,
    card_id: input.cardId,
    review_count: reviewCountBefore + 1,
    correct_count: (prev?.correct_count ?? 0) + (isCorrect ? 1 : 0),
    incorrect_count: (prev?.incorrect_count ?? 0) + (isCorrect ? 0 : 1),
    last_reviewed_at: new Date().toISOString(),
    next_due_at: schedule.nextDueAt.toISOString(),
    easiness_factor: schedule.easinessFactor,
    interval_days: schedule.intervalDays,
    mastery_level: schedule.masteryLevel,
  };

  const { error: upsertError } = await supabase
    .from("user_card_progress")
    .upsert(payload, { onConflict: "user_id,card_id" });

  if (upsertError) return { ok: false, error: upsertError.message };

  if (schedule.masteryLevel === "mastered") {
    const { data: streak } = await supabase
      .from("user_study_streaks")
      .select("total_cards_mastered")
      .eq("id", user.id)
      .maybeSingle();
    const total = (streak?.total_cards_mastered as number) ?? 0;
    if (!prev || prev.mastery_level !== "mastered") {
      await supabase.from("user_study_streaks").upsert({
        id: user.id,
        total_cards_mastered: total + 1,
      });
    }
  }

  const { data: session } = await supabase
    .from("study_sessions")
    .select("cards_reviewed, correct_count")
    .eq("id", input.sessionId)
    .maybeSingle();

  await supabase
    .from("study_sessions")
    .update({
      cards_reviewed: ((session?.cards_reviewed as number) ?? 0) + 1,
      correct_count: ((session?.correct_count as number) ?? 0) + (isCorrect ? 1 : 0),
    })
    .eq("id", input.sessionId);

  revalidatePath(`/study-guides/study/${input.deckId}`);
  revalidatePath("/dashboard/study-progress");
  return { ok: true };
}

export async function endStudySession(input: {
  sessionId: string;
  deckId: string;
  startedAt: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Unavailable" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const started = new Date(input.startedAt).getTime();
  const durationSeconds = Math.max(1, Math.round((Date.now() - started) / 1000));
  const sessionMinutes = Math.max(1, Math.round(durationSeconds / 60));

  const { data: session } = await supabase
    .from("study_sessions")
    .select("cards_reviewed, correct_count")
    .eq("id", input.sessionId)
    .maybeSingle();

  await supabase
    .from("study_sessions")
    .update({
      ended_at: new Date().toISOString(),
      session_duration_seconds: durationSeconds,
      cards_reviewed: session?.cards_reviewed ?? 0,
      correct_count: session?.correct_count ?? 0,
    })
    .eq("id", input.sessionId);

  if ((session?.cards_reviewed as number) > 0) {
    await updateStreak(user.id, sessionMinutes);
  }

  revalidatePath(`/study-guides`);
  revalidatePath(`/dashboard/study-progress`);
  return { ok: true };
}
