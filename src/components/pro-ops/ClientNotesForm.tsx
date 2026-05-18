"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import type { ProClientNotes } from "@/types/pro-ops";

type Props = {
  proId: string;
  clientKey: string;
  clientId: string | null;
  guestKey: string | null;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  initial: ProClientNotes | null;
};

export function ClientNotesForm({
  proId,
  clientKey,
  clientId,
  guestKey,
  guestName,
  guestEmail,
  guestPhone,
  initial,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    formula_notes: initial?.formula_notes ?? "",
    allergies: initial?.allergies ?? "",
    preferences: initial?.preferences ?? "",
    private_notes: initial?.private_notes ?? "",
    birthday: initial?.birthday ?? "",
    next_visit: initial?.next_visit ?? "",
    favorite: initial?.favorite ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/pro/client-notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pro_id: proId,
        client_id: clientId,
        guest_key: guestKey ?? clientKey,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        ...form,
      }),
    });
    setLoading(false);
    setMessage(res.ok ? "Saved." : "Could not save.");
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={(e) => void save(e)} className="space-y-4 rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
      <h3 className="font-heading text-lg text-gold">Client notes</h3>
      {(
        [
          ["formula_notes", "Formula / color notes"],
          ["allergies", "Allergies"],
          ["preferences", "Preferences"],
          ["private_notes", "Private notes (pro-only)"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block font-body text-sm">
          <span className="text-gold-body">{label}</span>
          <textarea
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
          />
        </label>
      ))}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block font-body text-sm">
          <span className="text-gold-body">Birthday</span>
          <input
            type="date"
            value={form.birthday}
            onChange={(e) => setForm((f) => ({ ...f, birthday: e.target.value }))}
            className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
          />
        </label>
        <label className="block font-body text-sm">
          <span className="text-gold-body">Next visit</span>
          <input
            type="date"
            value={form.next_visit}
            onChange={(e) => setForm((f) => ({ ...f, next_visit: e.target.value }))}
            className="mt-1 w-full rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 text-cream focus:ring-2 focus:ring-gold"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 font-body text-sm text-cream">
        <input
          type="checkbox"
          checked={form.favorite}
          onChange={(e) => setForm((f) => ({ ...f, favorite: e.target.checked }))}
          className="rounded border-gold/30 text-gold focus:ring-gold"
        />
        Favorite client
      </label>
      {message ? <p className="text-sm text-gold-body">{message}</p> : null}
      <GoldButton
        label={loading ? "Saving…" : "Save notes"}
        type="submit"
        variant="solid"
        size="md"
        className={loading ? "pointer-events-none opacity-70" : ""}
      />
    </form>
  );
}
