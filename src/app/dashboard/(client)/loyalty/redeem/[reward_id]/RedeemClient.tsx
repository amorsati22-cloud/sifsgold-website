"use client";

import { useState } from "react";
import Link from "next/link";

type Reward = {
  id: string;
  name: string;
  cost_points: number;
  program_id: string;
} | null;

export function RedeemClient({ reward }: { reward: Reward }) {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!reward) {
    return (
      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
        <p className="text-white/70">Reward not found.</p>
        <Link href="/dashboard/loyalty" className="mt-4 inline-block text-gold underline">
          Back to loyalty
        </Link>
      </div>
    );
  }

  async function redeem() {
    if (!reward) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reward_id: reward.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Redemption failed");
      setCode(data.redemption_code ?? data.code ?? "CONFIRMED");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Redemption failed");
    } finally {
      setLoading(false);
    }
  }

  if (code) {
    return (
      <div className="rounded-xl border border-gold/30 bg-navy-900/50 p-6">
        <h1 className="text-xl font-semibold text-gold">Redeemed</h1>
        <p className="mt-2 text-white/80">{reward.name}</p>
        <p className="mt-4 font-mono text-lg text-white">{code}</p>
        <p className="mt-2 text-sm text-white/60">Show this code to redeem your reward.</p>
        <Link href="/dashboard/loyalty" className="mt-6 inline-block text-gold underline">
          Back to loyalty
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
      <h1 className="text-xl font-semibold text-gold">Redeem reward</h1>
      <p className="mt-2 text-white/80">{reward.name}</p>
      <p className="mt-1 text-sm text-goldBody">{reward.cost_points} points</p>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <button
        type="button"
        onClick={redeem}
        disabled={loading}
        className="mt-6 rounded-lg bg-gold px-4 py-2 font-medium text-navy-950 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
      >
        {loading ? "Redeeming…" : "Confirm redemption"}
      </button>
      <Link href={`/dashboard/loyalty/${reward.program_id}`} className="mt-4 block text-sm text-white/60 underline">
        Cancel
      </Link>
    </div>
  );
}
