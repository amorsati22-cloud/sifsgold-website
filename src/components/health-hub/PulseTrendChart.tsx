"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { pulseTrendMoodScore } from "@/lib/health-hub/insights-engine";
import type { DailyPulseLog } from "@/types/health-hub";

export function PulseTrendChart({ logs }: { logs: DailyPulseLog[] }) {
  const theme = useTheme();

  const data = logs.map((l) => ({
    date: new Date(l.logged_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    energy: l.energy_level,
    mood: pulseTrendMoodScore(l.mood_label),
  }));

  if (data.length === 0) {
    return (
      <p className="font-body text-sm text-cream/70">Log a few check-ins to see your 30-day trend.</p>
    );
  }

  return (
    <div
      className="h-64 w-full rounded-brand-lg border border-gold/15 bg-navy-deep/50 p-4"
      role="img"
      aria-label="Line chart of energy and mood over the last 30 days"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={theme.colors.goldBody} strokeOpacity={0.15} />
          <XAxis dataKey="date" tick={{ fill: theme.colors.cream, fontSize: 11 }} />
          <YAxis domain={[0, 10]} tick={{ fill: theme.colors.cream, fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.colors.navyDeep,
              border: `1px solid ${theme.colors.gold}`,
              borderRadius: 8,
            }}
            labelStyle={{ color: theme.colors.cream }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="energy"
            name="Energy"
            stroke={theme.colors.gold}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="mood"
            name="Mood"
            stroke={theme.colors.teal}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
