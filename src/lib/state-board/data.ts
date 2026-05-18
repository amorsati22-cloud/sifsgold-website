import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_QUIZ_COUNT,
  FULL_EXAM_QUESTION_COUNT,
  PUBLISHED_STATE_CODES,
  QUICK_QUIZ_COUNT,
  SLUG_TO_STATE_CODE,
  STATE_CODE_TO_SLUG,
} from "@/lib/state-board/constants";
import { PUBLISHED_EXAM_SEEDS } from "@/lib/state-board/seed-content";
import {
  estimateReadiness,
  scorePercent,
  weakestCategory,
} from "@/lib/state-board/scoring";
import type {
  PracticeTestAttempt,
  Question,
  QuestionCategory,
  QuizMode,
  StateBoardExam,
  StateBoardProgress,
} from "@/types/state-board";

function seedExam(stateCode: string, program: string) {
  return PUBLISHED_EXAM_SEEDS.find(
    (s) => s.exam.state === stateCode && s.exam.program_type === program,
  );
}

export async function getStateBoardUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export function isPublishedCombo(stateSlug: string, program: string): boolean {
  const code = SLUG_TO_STATE_CODE[stateSlug.toLowerCase()];
  return (
    !!code &&
    PUBLISHED_STATE_CODES.includes(code as (typeof PUBLISHED_STATE_CODES)[number]) &&
    program === "cosmetology"
  );
}

export async function getExam(
  stateSlug: string,
  program: string,
): Promise<StateBoardExam | null> {
  const code = SLUG_TO_STATE_CODE[stateSlug.toLowerCase()];
  if (!code) return null;

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("state_board_exams")
      .select("*")
      .eq("state", code)
      .eq("program_type", program)
      .maybeSingle();
    if (data) return data as StateBoardExam;
  }

  const seed = seedExam(code, program);
  return seed ? (seed.exam as StateBoardExam) : null;
}

export async function getExamQuestions(examId: string): Promise<Question[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("exam_id", examId);
    if (data?.length) return data as Question[];
  }

  const seed = PUBLISHED_EXAM_SEEDS.find((s) => s.exam.id === examId);
  return (seed?.questions as Question[]) ?? [];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function pickQuestions(
  examId: string,
  mode: QuizMode,
  category?: QuestionCategory,
): Promise<Question[]> {
  const all = await getExamQuestions(examId);
  const gradable = all.filter(
    (q) => q.question_type === "multiple_choice" || q.question_type === "true_false",
  );
  const flashcards = all.filter((q) => q.question_type === "flashcard");

  if (mode === "quick") {
    return shuffle([...gradable, ...flashcards]).slice(0, QUICK_QUIZ_COUNT);
  }
  if (mode === "category" && category) {
    const pool = all.filter((q) => q.category === category);
    return shuffle(pool).slice(0, CATEGORY_QUIZ_COUNT);
  }
  if (mode === "full") {
    return shuffle(gradable).slice(0, FULL_EXAM_QUESTION_COUNT);
  }
  return shuffle(gradable).slice(0, QUICK_QUIZ_COUNT);
}

export async function getCategoryCounts(
  examId: string,
): Promise<Record<string, number>> {
  const questions = await getExamQuestions(examId);
  const counts: Record<string, number> = {};
  for (const q of questions) {
    counts[q.category] = (counts[q.category] ?? 0) + 1;
  }
  return counts;
}

export async function getAttemptsForExam(
  userId: string,
  examId: string,
): Promise<PracticeTestAttempt[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("practice_test_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("exam_id", examId)
    .order("started_at", { ascending: false })
    .limit(10);
  return (data as PracticeTestAttempt[]) ?? [];
}

export async function getBestScore(
  userId: string,
  examId: string,
): Promise<number | null> {
  const attempts = await getAttemptsForExam(userId, examId);
  const completed = attempts.filter((a) => a.score_percent != null);
  if (!completed.length) return null;
  return Math.max(...completed.map((a) => Number(a.score_percent)));
}

export async function getStateBoardProgress(
  userId: string,
  stateSlug?: string,
  program = "cosmetology",
): Promise<StateBoardProgress> {
  const slug = stateSlug ?? "tx";
  const exam = await getExam(slug, program);
  const supabase = await createClient();

  let attempts: PracticeTestAttempt[] = [];
  if (supabase && exam) {
    const { data } = await supabase
      .from("practice_test_attempts")
      .select("*")
      .eq("user_id", userId)
      .eq("exam_id", exam.id)
      .not("completed_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(20);
    attempts = (data as PracticeTestAttempt[]) ?? [];
  }

  const scores = attempts
    .map((a) => Number(a.score_percent))
    .filter((n) => !Number.isNaN(n));
  const averageScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const merged: Record<string, number> = {};
  for (const a of attempts) {
    const b = (a.category_breakdown ?? {}) as Record<string, number>;
    for (const [k, v] of Object.entries(b)) {
      if (!merged[k]) merged[k] = v;
      else merged[k] = (merged[k] + v) / 2;
    }
  }

  const categoryMastery = Object.entries(merged).map(([category, percent]) => ({
    category,
    percent: Math.round(percent * 100),
  }));

  const weak = weakestCategory(
    Object.fromEntries(categoryMastery.map((c) => [c.category, c.percent / 100])),
  );

  return {
    exams: exam
      ? [
          {
            ...exam,
            bestScorePercent: bestScore || null,
            attemptCount: attempts.length,
          },
        ]
      : [],
    selectedExam: exam,
    totalAttempts: attempts.length,
    averageScore,
    bestScore,
    categoryMastery,
    weakestCategory: weak,
    readinessPercent: estimateReadiness(scores.slice(0, 5), merged),
    streakDays: computeStreak(attempts),
  };
}

function computeStreak(attempts: PracticeTestAttempt[]): number {
  if (!attempts.length) return 0;
  const days = new Set(
    attempts.map((a) => (a.completed_at ?? a.started_at).slice(0, 10)),
  );
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      d.setUTCDate(d.getUTCDate() - 1);
    } else break;
  }
  return streak;
}

export function stateSlugFromCode(code: string): string {
  return STATE_CODE_TO_SLUG[code] ?? code.toLowerCase();
}
