"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { logHydration } from "@/lib/health-hub/actions";
import {
  HYDRATION_DISCLAIMER,
  HYDRATION_GOAL_MAX,
  HYDRATION_GOAL_MIN,
  HYDRATION_QUICK_OZ,
} from "@/lib/health-hub/constants";
import { GoldButton } from "@/components/ui/GoldButton";
import type { HydrationLog } from "@/types/health-hub";

function weeklyAverage(logs: HydrationLog[]) {
  const byDay = new Map<string, number>();
  for (const log of logs) {
    const day = log.logged_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + Number(log.amount_oz));
  }
  return [...byDay.entries()]
    .slice(-7)
    .map(([date, oz]) => ({
      date: date.slice(5),
      oz: Math.round(oz),
    }));
}

export function HydrationPanel({
  logs,
  todayOz,
  goalOz,
}: {
  logs: HydrationLog[];
  todayOz: number;
  goalOz: number;
}) {
  const theme = useTheme();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const pct = Math.min(100, Math.round((todayOz / goalOz) * 100));
  const chartData = weeklyAverage(logs);

  async function addOz(oz: number) {
    setError(null);
    const result = await logHydration(oz);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <p className="font-body text-xs text-goldBody">{HYDRATION_DISCLAIMER}</p>

      <div className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6">
        <p className="font-body text-sm text-cream/80">Today</p>
        <p className="mt-1 font-heading text-3xl text-gold">
          {Math.round(todayOz)} <span className="text-lg text-cream/70">/ {goalOz} oz</span>
        </p>
        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Today's hydration progress"
        >
          <div
            className="h-full rounded-full bg-teal transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 font-body text-xs text-cream/60">
          Goals are capped between {HYDRATION_GOAL_MIN}–{HYDRATION_GOAL_MAX} oz/day in settings.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {HYDRATION_QUICK_OZ.map((oz) => (
          <GoldButton key={oz} label={`+${oz} oz`} variant="outlined" onClick={() => addOz(oz)} />
        ))}
      </div>

      <section aria-labelledby="hydration-week-heading">
        <h2 id="hydration-week-heading" className="font-heading text-lg text-gold">
          Weekly average
        </h2>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke={theme.colors.goldBody} strokeOpacity={0.15} />
              <XAxis dataKey="date" tick={{ fill: theme.colors.cream, fontSize: 10 }} />
              <YAxis tick={{ fill: theme.colors.cream, fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.navyDeep,
                  border: `1px solid ${theme.colors.gold}`,
                }}
              />
              <Bar dataKey="oz" name="oz" fill={theme.colors.teal} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
