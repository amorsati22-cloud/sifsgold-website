"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PUBLISHED_EXAM_SEEDS } from "@/lib/state-board/seed-content";
import {
  computeCategoryBreakdown,
  isAnswerCorrect,
  scorePercent,
} from "@/lib/state-board/scoring";
import type { Question, QuizMode } from "@/types/state-board";
import { getExamQuestions, pickQuestions } from "@/lib/state-board/data";

export async function startPracticeAttempt(input: {
  examId: string;
  mode: QuizMode;
  category?: string;
}): Promise<
  | { ok: true; attemptId: string; questions: Question[] }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  if (!supabase) {
    const seed = PUBLISHED_EXAM_SEEDS.find((s) => s.exam.id === input.examId);
    if (!seed) return { ok: false, error: "Exam not found." };
    const questions = await pickQuestions(input.examId, input.mode, input.category as never);
    return { ok: true, attemptId: `local-${Date.now()}`, questions };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to save progress." };

  const questions = await pickQuestions(input.examId, input.mode, input.category as never);
  const { data, error } = await supabase
    .from("practice_test_attempts")
    .insert({ user_id: user.id, exam_id: input.examId })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Could not start attempt." };
  return { ok: true, attemptId: data.id as string, questions };
}

export async function completePracticeAttempt(input: {
  attemptId: string;
  examId: string;
  stateSlug: string;
  program: string;
  answers: Record<string, string>;
  questionIds: string[];
  timeElapsedSeconds: number;
  passingScore: number;
}): Promise<{ ok: boolean; scorePercent: number; passed: boolean; breakdown: Record<string, number> }> {
  const supabase = await createClient();
  const allQuestions = await getExamQuestions(input.examId);
  const questions = allQuestions.filter((q) => input.questionIds.includes(q.id));

  let correct = 0;
  for (const q of questions) {
    const ans = input.answers[q.id];
    if (ans && isAnswerCorrect(q as Question, ans)) correct += 1;
  }
  const total = questions.length;
  const pct = scorePercent(correct, total);
  const passed = pct >= input.passingScore;
  const breakdown = computeCategoryBreakdown(questions, input.answers);

  if (!supabase || input.attemptId.startsWith("local-")) {
    return { ok: true, scorePercent: pct, passed, breakdown };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, scorePercent: pct, passed, breakdown };

  await supabase
    .from("practice_test_attempts")
    .update({
      completed_at: new Date().toISOString(),
      time_elapsed_seconds: input.timeElapsedSeconds,
      questions_answered: total,
      correct_count: correct,
      score_percent: pct,
      passed,
      category_breakdown: breakdown,
    })
    .eq("id", input.attemptId);

  for (const q of questions) {
    const ans = input.answers[q.id];
    if (!ans) continue;
    await supabase.from("user_question_history").insert({
      user_id: user.id,
      question_id: q.id,
      answered_correctly: isAnswerCorrect(q, ans),
      time_to_answer_seconds: null,
    });
  }

  revalidatePath(`/state-board-prep/${input.stateSlug}/${input.program}`);
  revalidatePath("/dashboard/state-board-progress");
  return { ok: true, scorePercent: pct, passed, breakdown };
}
