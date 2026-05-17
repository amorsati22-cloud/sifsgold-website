"use client";

import { useMemo, useState } from "react";
import { GlassInput } from "@/components/ui/GlassInput";

const PRESETS = [10, 15, 18, 20, 25] as const;

export function TipCalculatorClient() {
  const [price, setPrice] = useState("85");
  const [tipPct, setTipPct] = useState(18);
  const [taxPct, setTaxPct] = useState(7.5);

  const totals = useMemo(() => {
    const p = Number.parseFloat(price);
    if (!Number.isFinite(p) || p < 0) {
      return { subtotal: 0, tax: 0, tip: 0, total: 0 };
    }
    const tax = (p * taxPct) / 100;
    const tip = (p * tipPct) / 100;
    const total = p + tax + tip;
    return { subtotal: p, tax, tip, total };
  }, [price, taxPct, tipPct]);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="svc-price">
          Service price (USD)
        </label>
        <GlassInput id="svc-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-offwhite" htmlFor="tip-range">
            Tip ({tipPct}%)
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTipPct(n)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  tipPct === n ? "border-gold bg-gold text-navy" : "border-gold/40 text-gold hover:bg-gold/10"
                }`}
              >
                {n}%
              </button>
            ))}
          </div>
        </div>
        <input
          id="tip-range"
          type="range"
          min={0}
          max={35}
          value={tipPct}
          onChange={(e) => setTipPct(Number(e.target.value))}
          className="mt-3 w-full accent-gold"
        />
        <p className="mt-1 text-xs text-cream/55">Drag for custom percentages beyond presets.</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="tax">
          Sales tax (%)
        </label>
        <GlassInput
          id="tax"
          inputMode="decimal"
          value={String(taxPct)}
          onChange={(e) => setTaxPct(Number.parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="rounded-brand-lg border border-gold/30 bg-navy-deep/80 p-6">
        <p className="text-sm text-cream/75">Tip amount</p>
        <p className="font-heading text-3xl text-gold">${totals.tip.toFixed(2)}</p>
        <p className="mt-4 text-sm text-cream/75">Estimated total (service + tax + tip)</p>
        <p className="font-heading text-3xl text-cream">${totals.total.toFixed(2)}</p>
      </div>

      <section className="rounded-brand-lg border border-gold/15 bg-navy-deep/60 p-6 text-sm leading-relaxed text-cream/85">
        <h2 className="font-heading text-lg text-gold">Tipping etiquette in the beauty industry</h2>
        <p className="mt-3">
          Tips reward craft, time-on-feet, and judgment — not just throughput. When a service includes assistants, clarify
          whether gratuity is pooled. For large transformations, many clients anchor on 18–20% when outcomes exceed
          expectations.
        </p>
        <p className="mt-3 text-cream/70">Calculator outputs are estimates; rounding and local tax rules vary.</p>
      </section>
    </div>
  );
}
