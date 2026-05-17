"use client";

import { useMemo, useState } from "react";
import { ALL_STATE_SLUGS, STATE_BOARD_STUBS } from "@/data/states";

export function HoursTrackerDemoClient() {
  const [state, setState] = useState("mn");
  const [logged, setLogged] = useState(820);

  const stub = STATE_BOARD_STUBS[state];
  const target = useMemo(() => {
    const match = stub?.hoursCosmetology.match(/[\d,]+/);
    if (!match) return 1500;
    return Number.parseInt(match[0].replace(/,/g, ""), 10) || 1500;
  }, [stub]);

  const pct = Math.min(100, Math.round((logged / target) * 100));

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="demo-state">
          State (demo)
        </label>
        <select
          id="demo-state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          {[...ALL_STATE_SLUGS].sort().map((slug) => (
            <option key={slug} value={slug}>
              {STATE_BOARD_STUBS[slug]?.displayName ?? slug}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-cream/60">
          Cosmetology hours (stub): <strong className="text-gold">{stub?.hoursCosmetology}</strong>
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="logged-hours">
          Logged hours (demo slider)
        </label>
        <input
          id="logged-hours"
          type="range"
          min={0}
          max={target}
          value={logged}
          onChange={(e) => setLogged(Number(e.target.value))}
          className="w-full accent-gold"
        />
        <p className="mt-2 text-sm text-cream">
          {logged} / {target} hours ({pct}%)
        </p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-navy-deep">
          <div className="h-full bg-gradient-to-r from-teal to-gold transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-6 text-sm leading-relaxed text-cream/85">
        <h2 className="font-heading text-lg text-gold">See your hours progress at a glance</h2>
        <p className="mt-3">
          Schools and apprenticeships need receipts, signatures, and photos — not spreadsheets that disappear on a phone
          swap. This demo shows how a progress rail feels inside the product experience.
        </p>
        <p className="mt-4 font-semibold text-gold">
          Full hour tracking with photo scan is in the Sif&apos;s Gold app — including supervisor attestations and export for
          board audits.
        </p>
      </div>
    </div>
  );
}
