import type { Question, QuestionCategory } from "@/types/state-board";

export function isAnswerCorrect(question: Question, answer: string): boolean {
  return answer.toUpperCase() === question.correct_answer.toUpperCase();
}

export function scorePercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 10000) / 100;
}

export function computeCategoryBreakdown(
  questions: Question[],
  answers: Record<string, string>,
): Record<string, number> {
  const totals: Record<string, { correct: number; total: number }> = {};

  for (const q of questions) {
    if (!totals[q.category]) totals[q.category] = { correct: 0, total: 0 };
    totals[q.category].total += 1;
    const ans = answers[q.id];
    if (ans && isAnswerCorrect(q, ans)) totals[q.category].correct += 1;
  }

  const breakdown: Record<string, number> = {};
  for (const [cat, { correct, total }] of Object.entries(totals)) {
    breakdown[cat] = total > 0 ? Math.round((correct / total) * 100) / 100 : 0;
  }
  return breakdown;
}

export function weakestCategory(
  breakdown: Record<string, number>,
): QuestionCategory | null {
  let min = 1;
  let weak: QuestionCategory | null = null;
  for (const [cat, pct] of Object.entries(breakdown)) {
    if (pct < min) {
      min = pct;
      weak = cat as QuestionCategory;
    }
  }
  return weak;
}

export function estimateReadiness(
  recentScores: number[],
  categoryBreakdown: Record<string, number>,
): number {
  if (recentScores.length === 0) return 50;
  const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const cats = Object.values(categoryBreakdown);
  const catAvg =
    cats.length > 0 ? (cats.reduce((a, b) => a + b, 0) / cats.length) * 100 : avg;
  const blended = avg * 0.6 + catAvg * 0.4;
  return Math.min(100, Math.max(50, Math.round(blended)));
}
