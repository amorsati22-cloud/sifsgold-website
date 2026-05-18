"use client";

import { useCallback, useEffect, useState } from "react";

type Reward = {
  id: string;
  name: string;
  description: string | null;
  cost_points: number;
  reward_type: string;
  discount_percent: number | null;
  active: boolean;
  redemptions_count: number;
};

const REWARD_TYPES = [
  { value: "service_discount", label: "Service discount" },
  { value: "product_discount", label: "Product discount" },
  { value: "free_service", label: "Free service" },
  { value: "free_product", label: "Free product" },
  { value: "experience", label: "Experience" },
] as const;

const input =
  "mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 text-sm text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold";

export function RewardsClient() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/loyalty/rewards");
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to load rewards");
      return;
    }
    setRewards(data.rewards ?? []);
    setError(null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/loyalty/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        description: fd.get("description") || undefined,
        cost_points: Number(fd.get("cost_points")),
        reward_type: fd.get("reward_type"),
        discount_percent: fd.get("discount_percent") ? Number(fd.get("discount_percent")) : undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Could not create reward");
      return;
    }
    setShowForm(false);
    e.currentTarget.reset();
    await load();
  }

  async function toggleActive(reward: Reward) {
    const res = await fetch(`/api/loyalty/rewards/${reward.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !reward.active }),
    });
    if (res.ok) await load();
  }

  async function remove(rewardId: string) {
    if (!confirm("Deactivate this reward?")) return;
    const res = await fetch(`/api/loyalty/rewards/${rewardId}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg text-gold">Rewards catalog</h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {showForm ? "Cancel" : "Add reward"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {showForm ? (
        <form onSubmit={(e) => void onCreate(e)} className="rounded-brand-lg border border-gold/20 p-4 space-y-3">
          <label className="block text-sm text-cream">
            Name
            <input name="name" required className={input} />
          </label>
          <label className="block text-sm text-cream">
            Description
            <input name="description" className={input} />
          </label>
          <label className="block text-sm text-cream">
            Point cost
            <input name="cost_points" type="number" min={1} required defaultValue={100} className={input} />
          </label>
          <label className="block text-sm text-cream">
            Type
            <select name="reward_type" required className={input} defaultValue="service_discount">
              {REWARD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-cream">
            Discount % (optional)
            <input name="discount_percent" type="number" min={0} max={100} className={input} />
          </label>
          <button type="submit" className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy">
            Save reward
          </button>
        </form>
      ) : null}

      {loading ? (
        <p className="text-sm text-cream/70">Loading…</p>
      ) : rewards.length === 0 ? (
        <p className="text-sm text-cream/70">No rewards yet. Add one for clients to redeem.</p>
      ) : (
        <ul className="space-y-2">
          {rewards.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-brand-md border border-gold/15 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-cream">
                  {r.name}
                  {!r.active ? <span className="ml-2 text-xs text-cream/50">(inactive)</span> : null}
                </p>
                <p className="text-goldBody">
                  {r.cost_points} pts · {r.reward_type.replace(/_/g, " ")} · {r.redemptions_count} redeemed
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void toggleActive(r)}
                  className="text-gold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {r.active ? "Pause" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(r.id)}
                  className="text-cream/60 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
