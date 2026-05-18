"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function EnrollClient({ programId, programName }: { programId: string; programName: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enroll() {
    setLoading(true);
    setError(null);
    const ref = searchParams.get("ref") ?? undefined;
    const res = await fetch("/api/loyalty/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program_id: programId, referral_code: ref }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not join program");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-brand-lg border border-gold/30 p-6 text-center">
      <h2 className="font-display text-lg text-gold">Join {programName}</h2>
      <p className="mt-2 text-sm text-cream/70">Earn points on bookings and purchases, unlock tiers, and redeem rewards.</p>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <button
        type="button"
        disabled={loading}
        onClick={() => void enroll()}
        className="mt-4 rounded-full bg-gold px-6 py-2 text-sm font-semibold text-navy disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {loading ? "Joining…" : "Join program"}
      </button>
    </div>
  );
}
