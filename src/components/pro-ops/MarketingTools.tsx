"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";

export function MarketingTools() {
  const [birthdayAuto, setBirthdayAuto] = useState(true);
  const [rebookReminders, setRebookReminders] = useState(true);

  return (
    <div className="space-y-8">
      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Automated outreach</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={birthdayAuto}
              onChange={(e) => setBirthdayAuto(e.target.checked)}
              className="rounded border-gold/30 text-gold focus:ring-gold"
            />
            Send birthday wishes (uses client birthday from notes)
          </label>
          <label className="flex items-center gap-3 font-body text-sm text-cream">
            <input
              type="checkbox"
              checked={rebookReminders}
              onChange={(e) => setRebookReminders(e.target.checked)}
              className="rounded border-gold/30 text-gold focus:ring-gold"
            />
            Rebooking reminders for clients inactive 90+ days
          </label>
        </div>
        <p className="mt-3 font-body text-xs text-gold-body">
          Automated sends connect to your email engine at launch. Preferences are saved to your account.
        </p>
      </section>

      <section className="rounded-brand-lg border border-gold/15 bg-navy/50 p-5">
        <h2 className="font-heading text-lg text-gold">Promotional offer</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          Create a limited-time offer for your clients. Offers appear in Pass a Note and client notifications.
        </p>
        <GoldButton
          label="Create offer (coming soon)"
          variant="outlined"
          size="md"
          className="mt-4 pointer-events-none opacity-60"
        />
      </section>
    </div>
  );
}
