"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#D4A843", "#C49434", "#00C9B1", "#8B7355", "#4A5568"];

type Props = {
  thisMonth: number;
  lastMonth: number;
  byCategory: { name: string; value: number }[];
};

export function EarningsCharts({ thisMonth, lastMonth, byCategory }: Props) {
  const change =
    lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null;

  return (
    <div className="space-y-8">
      <motionless className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
          <p className="font-body text-xs uppercase text-gold-body">This month (net)</p>
          <p className="mt-2 font-heading text-3xl text-gold">${thisMonth.toFixed(2)}</p>
          {change != null ? (
            <p className={`mt-1 font-body text-sm ${change >= 0 ? "text-teal" : "text-red-300"}`}>
              {change >= 0 ? "+" : ""}
              {change}% vs last month
            </p>
          ) : null}
        </div>
        <div className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
          <p className="font-body text-xs uppercase text-gold-body">Last month (net)</p>
          <p className="mt-2 font-heading text-3xl text-cream">${lastMonth.toFixed(2)}</p>
        </div>
      </motionless>

      {byCategory.length > 0 ? (
        <section>
          <h3 className="mb-4 font-heading text-lg text-gold">By service category</h3>
          <div className="h-64 rounded-brand-lg border border-gold/15 bg-navy/40 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#04101E", border: "1px solid #D4A843" }}
                  formatter={(v: number) => [`$${v.toFixed(0)}`, "Revenue"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}
    </div>
  );
}
