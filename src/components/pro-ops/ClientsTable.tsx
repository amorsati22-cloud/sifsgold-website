"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProClientRow } from "@/types/pro-ops";

type Props = { clients: ProClientRow[] };

export function ClientsTable({ clients }: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "inactive">("all");

  const filtered = useMemo(() => {
    let rows = clients;
    if (filter === "favorites") rows = rows.filter((c) => c.favorite);
    if (filter === "inactive") {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const cut = cutoff.toISOString().slice(0, 10);
      rows = rows.filter((c) => c.last_visit && c.last_visit < cut);
    }
    if (q.trim()) {
      const lower = q.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.display_name.toLowerCase().includes(lower) ||
          c.email?.toLowerCase().includes(lower) ||
          c.phone?.includes(q),
      );
    }
    return rows;
  }, [clients, q, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search clients…"
          className="min-w-[200px] flex-1 rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
        />
        {(["all", "favorites", "inactive"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 font-body text-xs capitalize ${
              filter === f ? "bg-gold text-navy" : "border border-gold/30 text-cream"
            }`}
          >
            {f === "inactive" ? "90+ days" : f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-brand-lg border border-gold/15">
        <table className="w-full min-w-[640px] font-body text-sm">
          <thead>
            <tr className="border-b border-gold/15 bg-navy-deep/80 text-left text-gold-body">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Last visit</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">Spent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gold/10 hover:bg-white/5">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/pro/clients/${encodeURIComponent(c.id)}`} className="text-gold hover:underline">
                    {c.display_name}
                    {c.favorite ? " ★" : ""}
                  </Link>
                </td>
                <td className="px-4 py-3 text-cream/80">
                  {c.email ?? "—"}
                  {c.phone ? <br /> : null}
                  {c.phone ?? ""}
                </td>
                <td className="px-4 py-3 text-cream/80">{c.last_visit ?? "—"}</td>
                <td className="px-4 py-3 text-cream/80">{c.appointment_count}</td>
                <td className="px-4 py-3 text-gold">${c.total_spent.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 ? (
        <p className="font-body text-sm text-gold-body">No clients match your filters.</p>
      ) : null}
    </div>
  );
}
