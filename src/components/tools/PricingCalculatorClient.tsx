"use client";

import { useMemo, useState } from "react";
import { GlassInput } from "@/components/ui/GlassInput";

export function PricingCalculatorClient() {
  const [minutes, setMinutes] = useState("90");
  const [product, setProduct] = useState("12");
  const [overheadPct, setOverheadPct] = useState(35);
  const [marginPct, setMarginPct] = useState(45);

  const result = useMemo(() => {
    const m = Number.parseFloat(minutes);
    const prod = Number.parseFloat(product);
    if (!Number.isFinite(m) || m <= 0 || !Number.isFinite(prod) || prod < 0) {
      return { hourlyFloor: 0, recommended: 0 };
    }
    const hours = m / 60;
    const overheadMult = 1 + overheadPct / 100;
    const marginMult = 1 + marginPct / 100;
    const base = (prod * overheadMult) / Math.max(hours, 0.25);
    const recommended = base * marginMult;
    const hourlyFloor = recommended / hours;
    return { hourlyFloor, recommended };
  }, [marginPct, minutes, overheadPct, product]);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="svc-min">
            Service time (minutes)
          </label>
          <GlassInput id="svc-min" inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="prod-cost">
            Product cost (USD)
          </label>
          <GlassInput id="prod-cost" inputMode="decimal" value={product} onChange={(e) => setProduct(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-offwhite" htmlFor="overhead">
          Overhead load ({overheadPct}%)
        </label>
        <input
          id="overhead"
          type="range"
          min={10}
          max={80}
          value={overheadPct}
          onChange={(e) => setOverheadPct(Number(e.target.value))}
          className="mt-2 w-full accent-gold"
        />
        <p className="mt-1 text-xs text-cream/55">Rent, card fees, laundry, education, software, and front desk time.</p>
      </div>

      <div>
        <label className="text-sm font-medium text-offwhite" htmlFor="margin">
          Target profit margin ({marginPct}%)
        </label>
        <input
          id="margin"
          type="range"
          min={10}
          max={80}
          value={marginPct}
          onChange={(e) => setMarginPct(Number(e.target.value))}
          className="mt-2 w-full accent-gold"
        />
      </div>

      <div className="rounded-brand-lg border border-gold/30 bg-navy-deep/80 p-6">
        <p className="text-sm text-cream/75">Recommended service price</p>
        <p className="font-heading text-4xl text-gold">${result.recommended.toFixed(2)}</p>
        <p className="mt-2 text-xs text-cream/60">
          Implied hourly before tax: <span className="font-semibold text-cream">${result.hourlyFloor.toFixed(2)}</span>
        </p>
      </div>

      <section className="rounded-brand-lg border border-gold/15 bg-navy-deep/60 p-6 text-sm leading-relaxed text-cream/85">
        <h2 className="font-heading text-lg text-gold">Pricing strategy (quick read)</h2>
        <p className="mt-3">
          Price for the outcome and judgment, not only minutes. Bundles, deposits, and cancellation policies protect margin
          more than a single big ticket day. Revisit overhead quarterly — card mix and supply shocks move faster than rent.
        </p>
      </section>
    </div>
  );
}
