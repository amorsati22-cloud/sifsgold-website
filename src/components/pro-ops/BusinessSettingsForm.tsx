"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import { CANCELLATION_POLICIES } from "@/lib/services/constants";
import type { ProBusinessSettings } from "@/types/pro-ops";

export function BusinessSettingsForm({ initial }: { initial: ProBusinessSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/pro/business-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setMessage(res.ok ? "Settings saved." : "Could not save.");
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={(e) => void save(e)} className="space-y-8">
      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Business info</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["business_name", "Business name"],
              ["business_email", "Email"],
              ["business_phone", "Phone"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block font-body text-sm">
              <span className="text-gold-body">{label}</span>
              <input
                value={form[key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
              />
            </label>
          ))}
        </div>
        <label className="mt-3 block font-body text-sm">
          <span className="text-gold-body">Address</span>
          <textarea
            value={form.business_address ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, business_address: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
          />
        </label>
        <p className="mt-2 font-body text-xs text-gold-body">
          Tax ID is stored encrypted and used for 1099 reporting when enabled.
        </p>
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Booking preferences</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={form.auto_confirm_bookings}
              onChange={(e) => setForm((f) => ({ ...f, auto_confirm_bookings: e.target.checked }))}
              className="rounded border-gold/30 text-gold focus:ring-gold"
            />
            Auto-confirm online bookings
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={form.new_client_intake_required}
              onChange={(e) => setForm((f) => ({ ...f, new_client_intake_required: e.target.checked }))}
              className="rounded border-gold/30 text-gold focus:ring-gold"
            />
            Require intake for first-time clients
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={form.accepts_tips}
              onChange={(e) => setForm((f) => ({ ...f, accepts_tips: e.target.checked }))}
              className="rounded border-gold/30 text-gold focus:ring-gold"
            />
            Accept tips
          </label>
          <label className="block font-body text-sm">
            <span className="text-gold-body">Default deposit %</span>
            <input
              type="number"
              min={0}
              max={100}
              value={form.default_deposit_percent}
              onChange={(e) =>
                setForm((f) => ({ ...f, default_deposit_percent: Number(e.target.value) }))
              }
              className="mt-1 w-24 rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="block font-body text-sm">
            <span className="text-gold-body">Cancellation policy</span>
            <select
              value={form.cancellation_policy}
              onChange={(e) => setForm((f) => ({ ...f, cancellation_policy: e.target.value }))}
              className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
            >
              {CANCELLATION_POLICIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {message ? <p className="font-body text-sm text-gold-body">{message}</p> : null}
      <GoldButton
        label={loading ? "Saving…" : "Save business settings"}
        type="submit"
        variant="solid"
        size="lg"
        className={loading ? "pointer-events-none opacity-70" : ""}
      />
    </form>
  );
}
