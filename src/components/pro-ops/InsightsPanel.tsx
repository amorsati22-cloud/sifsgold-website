import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProInsights } from "@/types/pro-ops";

export function InsightsPanel({ insights }: { insights: ProInsights }) {
  return (
    <div className="space-y-10">
      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Top services this month</h2>
        {insights.topServices.length === 0 ? (
          <p className="mt-2 font-body text-sm text-gold-body">Not enough data yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {insights.topServices.map((s) => (
              <li key={s.name} className="flex justify-between font-body text-sm">
                <span className="text-cream">{s.name}</span>
                <span className="text-gold">
                  ${s.revenue.toFixed(0)} · {s.count} bookings
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Clients you haven&apos;t seen in 90 days</h2>
        {insights.inactiveClients.length === 0 ? (
          <p className="mt-2 font-body text-sm text-gold-body">Great retention — no lapsed clients in this window.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {insights.inactiveClients.map((c) => (
              <li key={c.email ?? c.name} className="font-body text-sm text-cream/80">
                {c.name}
                {c.email ? ` · ${c.email}` : ""} — last visit {c.last_visit}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
          <h2 className="font-heading text-lg text-gold">Busiest day</h2>
          <p className="mt-2 font-heading text-2xl text-gold">{insights.busiestDay}</p>
        </div>
        <div className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
          <h2 className="font-heading text-lg text-gold">Average ticket trend</h2>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.avgTicketTrend}>
                <XAxis dataKey="month" stroke="#C49434" fontSize={11} />
                <YAxis stroke="#C49434" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "#04101E", border: "1px solid #D4A843" }}
                  formatter={(v: number) => [`$${v.toFixed(0)}`, "Avg ticket"]}
                />
                <Line type="monotone" dataKey="avg" stroke="#D4A843" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
