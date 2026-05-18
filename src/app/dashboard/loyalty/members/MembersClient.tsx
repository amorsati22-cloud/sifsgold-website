"use client";

import { useMemo, useState } from "react";

type Member = {
  id: string;
  points_balance: number;
  current_tier: string;
  last_activity?: string;
  profiles?: { full_name?: string; email?: string };
};

export function MembersClient({ members }: { members: Member[] }) {
  const [tier, setTier] = useState<string>("all");
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [pointsChange, setPointsChange] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const tiers = useMemo(() => {
    const set = new Set(members.map((m) => m.current_tier));
    return ["all", ...Array.from(set).sort()];
  }, [members]);

  const filtered = useMemo(() => {
    if (tier === "all") return members;
    return members.filter((m) => m.current_tier === tier);
  }, [members, tier]);

  async function submitAdjust(membershipId: string) {
    const delta = Number(pointsChange);
    if (!delta || Number.isNaN(delta)) {
      setMessage("Enter a non-zero point change.");
      return;
    }
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/loyalty/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membership_id: membershipId,
        points_change: delta,
        description: note || "Manual adjustment",
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error ?? "Adjustment failed");
      return;
    }
    setMessage(`Updated balance: ${data.balance} points`);
    setAdjustId(null);
    setPointsChange("");
    setNote("");
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-cream">
          Filter by tier
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="ml-2 rounded-brand-sm border border-gold/30 bg-navy-lift px-2 py-1 text-sm text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All tiers" : t}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-goldBody">{filtered.length} member(s)</p>
      </div>

      {message ? <p className="text-sm text-gold">{message}</p> : null}

      <ul className="space-y-2">
        {filtered.map((m) => (
          <li key={m.id} className="rounded-brand-md border border-gold/15 px-4 py-3 text-sm text-cream">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{m.profiles?.full_name ?? m.profiles?.email ?? "Member"}</p>
                <p className="text-goldBody">
                  {m.points_balance} pts · {m.current_tier}
                  {m.last_activity ? ` · last active ${new Date(m.last_activity).toLocaleDateString()}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustId(adjustId === m.id ? null : m.id)}
                className="text-gold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Adjust points
              </button>
            </div>
            {adjustId === m.id ? (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-gold/10 pt-3">
                <input
                  type="number"
                  placeholder="+/- points"
                  value={pointsChange}
                  onChange={(e) => setPointsChange(e.target.value)}
                  className="w-28 rounded-brand-sm border border-gold/30 bg-navy-lift px-2 py-1 text-cream"
                />
                <input
                  type="text"
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-w-[12rem] flex-1 rounded-brand-sm border border-gold/30 bg-navy-lift px-2 py-1 text-cream"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void submitAdjust(m.id)}
                  className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
