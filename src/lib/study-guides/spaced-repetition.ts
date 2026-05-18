import type { MasteryLevel, StudyGrade } from "@/types/study-guides";

/** SM-2 quality 0–5: 0 = blackout, 5 = perfect recall */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export function gradeToQuality(grade: StudyGrade): ReviewQuality {
  switch (grade) {
    case "again":
      return 0;
    case "hard":
      return 2;
    case "good":
      return 4;
    case "easy":
      return 5;
  }
}

export type Sm2ScheduleResult = {
  easinessFactor: number;
  intervalDays: number;
  nextDueAt: Date;
  masteryLevel: MasteryLevel;
};

const MIN_EF = 1.3;
const DEFAULT_EF = 2.5;

/**
 * SM-2 spaced repetition — schedules next review from easiness factor,
 * prior interval, and review count (successful repetition index).
 */
export function calculateNextReview(
  currentEF: number,
  currentIntervalDays: number,
  reviewCountBefore: number,
  quality: ReviewQuality,
): Sm2ScheduleResult {
  let ef = Number.isFinite(currentEF) ? currentEF : DEFAULT_EF;

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < MIN_EF) ef = MIN_EF;

  let intervalDays = 1;

  if (quality < 3) {
    intervalDays = 1;
  } else if (reviewCountBefore <= 0) {
    intervalDays = 1;
  } else if (reviewCountBefore === 1) {
    intervalDays = 6;
  } else {
    const base = currentIntervalDays > 0 ? currentIntervalDays : 6;
    intervalDays = Math.max(1, Math.round(base * ef));
  }

  const nextDueAt = new Date();
  nextDueAt.setUTCDate(nextDueAt.getUTCDate() + intervalDays);

  const masteryLevel = deriveMasteryLevel(quality, intervalDays, reviewCountBefore);

  return {
    easinessFactor: Math.round(ef * 100) / 100,
    intervalDays,
    nextDueAt,
    masteryLevel,
  };
}

function deriveMasteryLevel(
  quality: ReviewQuality,
  intervalDays: number,
  reviewCountBefore: number,
): MasteryLevel {
  if (reviewCountBefore === 0 && quality < 3) return "new";
  if (quality < 3 || intervalDays < 3) return "learning";
  if (intervalDays >= 21) return "mastered";
  if (intervalDays >= 6) return "familiar";
  return "learning";
}
