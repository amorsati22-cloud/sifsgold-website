import type {
  DailyPulseLog,
  HealthInsight,
  HydrationLog,
  PreshiftRitualSession,
} from "@/types/health-hub";

export function correlateSleepWithEnergy(logs: DailyPulseLog[]): HealthInsight | null {
  const withSleep = logs.filter(
    (l) => l.sleep_hours != null && l.sleep_hours >= 7 && l.energy_level >= 7,
  );
  const lowSleep = logs.filter(
    (l) => l.sleep_hours != null && l.sleep_hours < 6,
  );
  if (logs.length < 5) return null;

  const highPct = (withSleep.length / logs.length) * 100;
  if (highPct >= 40) {
    return {
      id: "sleep-energy",
      title: "Sleep and energy",
      body: "Your best mornings tend to follow 7+ hours of sleep.",
      category: "sleep",
    };
  }
  if (lowSleep.length >= 3 && lowSleep.every((l) => l.energy_level <= 5)) {
    return {
      id: "sleep-energy-low",
      title: "Sleep and energy",
      body: "Days under 6 hours of sleep often align with lower energy scores for you.",
      category: "sleep",
    };
  }
  return null;
}

export function hydrationAdherence(
  logs: HydrationLog[],
  goalOz: number,
  days = 7,
): HealthInsight | null {
  if (logs.length === 0 || goalOz <= 0) return null;

  const byDay = new Map<string, number>();
  for (const log of logs) {
    const day = log.logged_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + Number(log.amount_oz));
  }

  const recentDays = [...byDay.entries()].slice(0, days);
  if (recentDays.length < 3) return null;

  const metGoal = recentDays.filter(([, oz]) => oz >= goalOz * 0.8).length;
  const pct = Math.round((metGoal / recentDays.length) * 100);

  return {
    id: "hydration-adherence",
    title: "Hydration consistency",
    body: `You met about ${pct}% of your hydration goal on logged days this week.`,
    category: "hydration",
  };
}

export function crossTrackerInsight(
  pulseLogs: DailyPulseLog[],
  hydrationLogs: HydrationLog[],
  goalOz: number,
): HealthInsight | null {
  if (pulseLogs.length < 7 || hydrationLogs.length < 7) return null;

  const hydrationByDay = new Map<string, number>();
  for (const h of hydrationLogs) {
    const day = h.logged_at.slice(0, 10);
    hydrationByDay.set(day, (hydrationByDay.get(day) ?? 0) + Number(h.amount_oz));
  }

  let highEnergyDays = 0;
  let highEnergyWithSleepAndHydration = 0;

  for (const p of pulseLogs) {
    if (p.energy_level < 8) continue;
    highEnergyDays += 1;
    const day = p.logged_at.slice(0, 10);
    const oz = hydrationByDay.get(day) ?? 0;
    if ((p.sleep_hours ?? 0) >= 7 && oz >= goalOz * 0.8) {
      highEnergyWithSleepAndHydration += 1;
    }
  }

  if (highEnergyDays < 3) return null;
  const ratio = highEnergyWithSleepAndHydration / highEnergyDays;
  if (ratio >= 0.5) {
    return {
      id: "cross-sleep-hydration",
      title: "Patterns across trackers",
      body: "Your highest energy days often correlate with 7+ hours of sleep and meeting your hydration goal.",
      category: "general",
    };
  }
  return null;
}

export function ritualMoodInsight(sessions: PreshiftRitualSession[]): HealthInsight | null {
  const completed = sessions.filter(
    (s) =>
      s.completed_at &&
      s.mood_before != null &&
      s.mood_after != null,
  );
  if (completed.length < 3) return null;

  const improved = completed.filter((s) => (s.mood_after ?? 0) > (s.mood_before ?? 0));
  const pct = Math.round((improved.length / completed.length) * 100);

  if (pct >= 50) {
    return {
      id: "ritual-mood",
      title: "Pre-shift ritual",
      body: `After completing pre-shift rituals, your mood rating improved ${pct}% of the time in your recent sessions.`,
      category: "ritual",
    };
  }
  return null;
}

export function buildInsights(input: {
  pulseLogs: DailyPulseLog[];
  hydrationLogs: HydrationLog[];
  ritualSessions: PreshiftRitualSession[];
  hydrationGoalOz: number;
}): HealthInsight[] {
  const insights: HealthInsight[] = [];
  const add = (i: HealthInsight | null) => {
    if (i) insights.push(i);
  };

  add(correlateSleepWithEnergy(input.pulseLogs));
  add(hydrationAdherence(input.hydrationLogs, input.hydrationGoalOz));
  add(
    crossTrackerInsight(
      input.pulseLogs,
      input.hydrationLogs,
      input.hydrationGoalOz,
    ),
  );
  add(ritualMoodInsight(input.ritualSessions));

  return insights;
}

export function pulseTrendMoodScore(mood: DailyPulseLog["mood_label"]): number {
  const map: Record<DailyPulseLog["mood_label"], number> = {
    great: 10,
    good: 8,
    okay: 6,
    low: 4,
    rough: 2,
  };
  return map[mood];
}
