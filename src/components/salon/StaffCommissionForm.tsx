"use client";

import { useState } from "react";
import type { SalonStaff } from "@/types/salon";

type Props = { salonId: string; staff: SalonStaff };

export function StaffCommissionForm({ salonId, staff }: Props) {
  const [commission, setCommission] = useState(String(staff.commission_split ?? 60));
  const [rent, setRent] = useState(String(staff.booth_rent_amount ?? ""));
  const [freq, setFreq] = useState(staff.booth_rent_frequency ?? "monthly");
  const [saved, setSaved] = useState(false);

  async function save() {
    await fetch(`/api/salons/${salonId}/staff/${staff.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commission_split: Number(commission),
        booth_rent_amount: rent ? Number(rent) : null,
        booth_rent_frequency: rent ? freq : null,
      }),
    });
    setSaved(true);
  }

  return (
    <section className="rounded-brand-lg border border-gold/15 p-4">
      <h2 className="mb-4 font-heading text-lg text-gold">Commission & booth rent</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="font-body text-sm text-gold">
          Commission % to pro
          <input
            type="number"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
          />
        </label>
        <label className="font-body text-sm text-gold">
          Booth rent ($)
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
          />
        </label>
        <label className="font-body text-sm text-gold">
          Frequency
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value as "weekly" | "monthly")}
            className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      </div>
      <button
        type="button"
        onClick={() => void save()}
        className="mt-4 rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy"
      >
        Save
      </button>
      {saved ? <p className="mt-2 font-body text-sm text-gold">Saved.</p> : null}
    </section>
  );
}
