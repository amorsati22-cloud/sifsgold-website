"use client";

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

type Row = { name: string; mastered: number; total: number };

export function MasteryChart({ data }: { data: Row[] }) {
  const theme = useTheme();
  const chartData = data.map((d) => ({
    name: d.name.length > 18 ? `${d.name.slice(0, 16)}…` : d.name,
    mastered: d.mastered,
    remaining: Math.max(0, d.total - d.mastered),
  }));

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-cream/70">Study a deck to see mastery by topic.</p>
    );
  }

  return (
    <div className="h-64 w-full" aria-label="Mastery by deck chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid stroke={theme.colors.borderMuted} strokeDasharray="3 3" />
          <XAxis type="number" stroke={theme.colors.creamMuted} fontSize={11} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            stroke={theme.colors.creamMuted}
            fontSize={11}
          />
          <Tooltip
            contentStyle={{
              background: theme.colors.navyDeep,
              border: `1px solid ${theme.colors.goldMuted}`,
              borderRadius: 8,
            }}
            labelStyle={{ color: theme.colors.gold }}
          />
          <Bar dataKey="mastered" stackId="a" fill={theme.colors.gold} name="Mastered" />
          <Bar
            dataKey="remaining"
            stackId="a"
            fill={theme.colors.navyLight}
            name="Remaining"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
