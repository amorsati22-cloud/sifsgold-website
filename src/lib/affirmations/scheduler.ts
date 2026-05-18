import type { AffirmationAudience, AffirmationSeason, DailyAffirmation } from "@/types/affirmations";
import { REPEAT_WINDOW_DAYS } from "@/lib/affirmations/constants";

function currentSeason(): AffirmationSeason {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "fall";
  return "winter";
}

function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Deterministic “affirmation of the day” from pool + date seed. */
export function pickDailyAffirmation(
  pool: DailyAffirmation[],
  audience: AffirmationAudience,
  date = new Date(),
): DailyAffirmation | null {
  const season = currentSeason();
  const eligible = pool.filter(
    (a) =>
      a.active &&
      a.target_audience.includes(audience) &&
      (a.season === null || a.season === season),
  );
  const list = eligible.length > 0 ? eligible : pool.filter((a) => a.active && a.target_audience.includes(audience));
  if (list.length === 0) return pool.find((a) => a.active) ?? null;
  const idx = dayOfYear(date) % list.length;
  return list[idx] ?? list[0];
}

/** Random next card excluding recent history (30-day window). */
export function pickNextAffirmation(
  pool: DailyAffirmation[],
  audience: AffirmationAudience,
  recentIds: Set<string>,
): DailyAffirmation | null {
  const season = currentSeason();
  let eligible = pool.filter(
    (a) =>
      a.active &&
      !recentIds.has(a.id) &&
      a.target_audience.includes(audience) &&
      (a.season === null || a.season === season),
  );
  if (eligible.length === 0) {
    eligible = pool.filter((a) => a.active && !recentIds.has(a.id) && a.target_audience.includes(audience));
  }
  if (eligible.length === 0) {
    eligible = pool.filter((a) => a.active && a.target_audience.includes(audience));
  }
  if (eligible.length === 0) return null;
  const i = Math.floor(Math.random() * eligible.length);
  return eligible[i] ?? null;
}

export function recentCutoffDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - REPEAT_WINDOW_DAYS);
  return d.toISOString();
}
