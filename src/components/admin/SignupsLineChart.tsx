"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";

type Point = { date: string; count: number };

export function SignupsLineChart({ data }: { data: Point[] }) {
  const { colors } = useTheme();

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke={colors.goldBody}
            fontSize={11}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis stroke={colors.goldBody} fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: colors.navyLift,
              border: `1px solid ${colors.gold}`,
              color: colors.cream,
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={colors.gold}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
