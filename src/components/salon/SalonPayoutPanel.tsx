"use client";

import { useState } from "react";
import type { SalonPayoutRecord, StaffPayoutLine } from "@/types/salon";

type Props = {
  salonId: string;
  initialLines: StaffPayoutLine[];
  initialHistory: SalonPayoutRecord[];
  periodStart: string;
  periodEnd: string;
};

export function SalonPayoutPanel({
  salonId,
  initialLines,
  initialHistory,
  periodStart,
  periodEnd,
}: Props) {
  const [lines] = useState(initialLines);
  const [history, setHistory] = useState(initialHistory);
  const [sending, setSending] = useState(false);

  const totalOwed = lines.reduce((s, l) => s + l.net_owed, 0);

  async function sendPayouts() {
    setSending(true);
    const res = await fetch(`/api/salons/${salonId}/payouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period_start: periodStart, period_end: periodEnd, lines }),
    });
    setSending(false);
    if (res.ok) {
      const data = await res.json();
      if (data.ok) window.location.reload();
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-brand-lg border border-gold/15 bg-navy/40 p-4">
        <p className="font-body text-sm text-gold-body">
          Period {periodStart} — {periodEnd}
        </p>
        <p className="mt-1 font-heading text-2xl text-gold">${totalOwed.toFixed(2)} total owed</p>
        <button
          type="button"
          onClick={() => void sendPayouts()}
          disabled={sending || totalOwed <= 0}
          className="mt-4 rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy disabled:opacity-50"
        >
          {sending ? "Processing…" : "Send payouts"}
        </button>
      </div>

      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-gold/15 text-left text-gold-body">
            <th className="py-2">Pro</th>
            <th className="py-2">Gross</th>
            <th className="py-2">Split</th>
            <th className="py-2">Rent</th>
            <th className="py-2">Net owed</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.staff_id} className="border-b border-gold/10">
              <td className="py-2 text-cream">{l.display_name}</td>
              <td className="py-2">${l.gross_revenue.toFixed(2)}</td>
              <td className="py-2">{l.commission_split}%</td>
              <td className="py-2">${l.booth_rent_deduction.toFixed(2)}</td>
              <td className="py-2 text-gold">${l.net_owed.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h3 className="mb-3 font-heading text-lg text-gold">Payout history</h3>
        <ul className="space-y-2">
          {history.map((h) => (
            <li
              key={h.id}
              className="flex justify-between rounded-brand-sm border border-gold/10 px-3 py-2 font-body text-sm"
            >
              <span className="text-cream">
                {h.display_name} · {h.period_start}
              </span>
              <span className="text-gold">
                ${h.net_owed.toFixed(2)} · {h.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
