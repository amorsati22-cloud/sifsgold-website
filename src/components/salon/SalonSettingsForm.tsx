"use client";

import { useState } from "react";
import type { Salon } from "@/types/salon";

type Props = {
  salon: Salon;
};

export function SalonSettingsForm({ salon: initial }: Props) {
  const [salon, setSalon] = useState(initial);
  const [ein, setEin] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/salons/${salon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...salon, ein: ein || undefined }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setSalon(data.salon);
      setEin("");
      setSaved(true);
    }
  }

  return (
    <form
      className="max-w-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <label className="block font-body text-sm text-gold">
        Salon name (public)
        <input
          value={salon.name}
          onChange={(e) => setSalon({ ...salon, name: e.target.value })}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
      </label>
      <label className="block font-body text-sm text-gold">
        Legal name
        <input
          value={salon.legal_name ?? ""}
          onChange={(e) => setSalon({ ...salon, legal_name: e.target.value })}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
      </label>
      <label className="block font-body text-sm text-gold">
        EIN (encrypted at rest)
        <input
          type="password"
          value={ein}
          onChange={(e) => setEin(e.target.value)}
          placeholder={salon.encrypted_ein ? "•••••••• (saved)" : "XX-XXXXXXX"}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
      </label>
      <label className="block font-body text-sm text-gold">
        Address
        <input
          value={salon.address_line_1 ?? ""}
          onChange={(e) => setSalon({ ...salon, address_line_1: e.target.value })}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <input
          value={salon.city ?? ""}
          onChange={(e) => setSalon({ ...salon, city: e.target.value })}
          placeholder="City"
          className="rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
        <input
          value={salon.state ?? ""}
          onChange={(e) => setSalon({ ...salon, state: e.target.value })}
          placeholder="State"
          className="rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
        <input
          value={salon.zip ?? ""}
          onChange={(e) => setSalon({ ...salon, zip: e.target.value })}
          placeholder="ZIP"
          className="rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
      </div>
      <label className="block font-body text-sm text-gold">
        Cancellation policy
        <textarea
          value={salon.cancellation_policy ?? ""}
          onChange={(e) => setSalon({ ...salon, cancellation_policy: e.target.value })}
          rows={3}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
      </label>
      <label className="block font-body text-sm text-gold">
        No-show policy
        <textarea
          value={salon.no_show_policy ?? ""}
          onChange={(e) => setSalon({ ...salon, no_show_policy: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 text-cream"
        />
      </label>
      <p className="font-body text-xs text-gold-body">
        Subscription: {salon.subscription_tier ?? "salon-standard"} — manage in billing (coming soon).
      </p>
      <button
        type="submit"
        disabled={saving}
        className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
      {saved ? <p className="font-body text-sm text-gold">Saved.</p> : null}
    </form>
  );
}
