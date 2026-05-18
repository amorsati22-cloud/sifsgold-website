"use client";

import { useState } from "react";
import { GoldButton } from "@/components/ui/GoldButton";
import { createClient } from "@/lib/supabase/client";
type Props = {
  count: number;
  required: number;
  userId: string;
};

export function MilestoneGate({ count, required, userId }: Props) {
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);

  async function notifyMe() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("video_call_milestone_notify").upsert({ user_id: userId });
    setNotified(true);
    setLoading(false);
  }

  return (
    <div className="rounded-brand-lg border border-gold/30 bg-navy-lift p-8 text-center">
      <h2 className="font-display text-xl text-gold">Video calls coming soon</h2>
      <p className="mx-auto mt-3 max-w-md font-body text-sm text-cream/80">
        Video calls unlock at {required} paid Sif&apos;s Gold subscribers. Current count:{" "}
        <span className="font-semibold text-gold">
          {count}/{required}
        </span>
        . We&apos;ll notify you when the milestone is reached.
      </p>
      <p className="mt-2 font-body text-xs text-goldBody">
        Mirrors the mobile app — 1:1 consultations, group classes, and brand partner meetings.
      </p>
      {!notified ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => void notifyMe()}
          className="mt-6 rounded-full border border-gold px-6 py-2 font-body text-sm text-gold hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50"
        >
          {loading ? "Saving…" : "Notify me when ready"}
        </button>
      ) : (
        <p className="mt-6 font-body text-sm text-gold">You&apos;re on the list.</p>
      )}
      <div className="mt-6">
        <GoldButton label="Back to dashboard" href="/dashboard/pro/home" variant="outlined" size="sm" />
      </div>
    </div>
  );
}
