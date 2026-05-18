import type { ProTodayKpis } from "@/types/pro-ops";

const cards = [
  { key: "appointmentsToday", label: "Today's appointments", format: (v: number) => String(v) },
  {
    key: "expectedRevenueToday",
    label: "Expected revenue today",
    format: (v: number) => `$${v.toFixed(0)}`,
  },
  { key: "pendingRequests", label: "Pending requests", format: (v: number) => String(v) },
  { key: "unreadMessages", label: "Unread messages", format: (v: number) => String(v) },
] as const;

export function ProKpiCards({ kpis }: { kpis: ProTodayKpis }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded-brand-lg border border-gold/15 bg-navy/50 p-4"
        >
          <p className="font-body text-xs uppercase tracking-wide text-gold-body">{c.label}</p>
          <p className="mt-2 font-heading text-2xl text-gold">{c.format(kpis[c.key])}</p>
        </div>
      ))}
    </div>
  );
}
