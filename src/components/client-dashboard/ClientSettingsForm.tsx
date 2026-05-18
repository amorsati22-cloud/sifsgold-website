"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";
import type { ClientSettings } from "@/types/client-dashboard";

type Props = {
  settings: ClientSettings;
  email: string;
  displayName: string;
};

export function ClientSettingsForm({ settings, email, displayName }: Props) {
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/client/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setMessage(res.ok ? "Settings saved." : "Could not save settings.");
  }

  return (
    <form onSubmit={(e) => void save(e)} className="space-y-8">
      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Profile</h2>
        <p className="mt-2 font-body text-sm text-cream/80">{displayName || "Member"}</p>
        <p className="font-body text-sm text-gold-body">{email}</p>
        <p className="mt-3 font-body text-xs text-gold-body">
          Name and photo updates ship in the mobile app at launch. Password reset uses the sign-in flow.
        </p>
        <GoldButton label="Change password" href="/forgot-password" variant="outlined" size="sm" className="mt-4" />
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Notifications</h2>
        <div className="mt-4 space-y-3">
          {(
            [
              ["email_reminders", "Email appointment reminders"],
              ["sms_reminders", "SMS reminders"],
              ["marketing_email", "Marketing & launch updates"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 font-body text-sm text-cream">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                className="rounded border-gold/30 text-gold focus:ring-gold"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Privacy</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={form.profile_visible}
              onChange={(e) => setForm((f) => ({ ...f, profile_visible: e.target.checked }))}
              className="rounded border-gold/30 text-gold focus:ring-gold"
            />
            Allow pros I book with to see my profile
          </label>
          <label className="flex items-center gap-3 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={form.vision_boards_visible_to_pros}
              onChange={(e) => setForm((f) => ({ ...f, vision_boards_visible_to_pros: e.target.checked }))}
              className="rounded border-gold/30 text-gold focus:ring-gold"
            />
            Share vision boards with attached pros only
          </label>
        </div>
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Location</h2>
        <p className="mt-1 font-body text-xs text-gold-body">Used for Discover near you</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="City"
            value={form.location_city ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, location_city: e.target.value }))}
            className="rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
          />
          <input
            placeholder="State"
            value={form.location_state ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, location_state: e.target.value }))}
            className="rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
          />
        </div>
      </section>

      {message ? <p className="font-body text-sm text-gold-body">{message}</p> : null}
      <GoldButton
        label={loading ? "Saving…" : "Save settings"}
        type="submit"
        variant="solid"
        size="lg"
        className={loading ? "pointer-events-none opacity-70" : ""}
      />

      <section className="rounded-brand-lg border border-red-500/30 bg-red-950/20 p-5">
        <h2 className="font-heading text-lg text-red-300">Account</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          To delete your account and data, visit our{" "}
          <a href="/data-request" className="text-gold underline">
            data request page
          </a>
          .
        </p>
      </section>
    </form>
  );
}
