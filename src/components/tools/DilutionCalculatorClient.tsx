"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateDilution, DILUTION_PRESETS } from "@/lib/tools/formulas";

export function DilutionCalculatorClient() {
  const [desired, setDesired] = useState("10");
  const [current, setCurrent] = useState("20");

  const result = useMemo(() => {
    const d = Number.parseFloat(desired) || 0;
    const c = Number.parseFloat(current) || 0;
    return calculateDilution(d, c);
  }, [desired, current]);

  return (
    <Calculator
      toolName="dilution-calculator"
      getPresetData={() => ({ desired, current })}
      disclaimers={["Always verify with product label — strengths vary by brand."]}
      results={
        <div>
          <p className="font-heading text-xl text-gold">{result.label}</p>
          {result.valid ? (
            <p className="mt-2 text-sm text-cream/75">
              Ratio: {result.productParts} : {result.diluentParts} (product : diluent)
            </p>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-wrap gap-2">
        {DILUTION_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setDesired(String(p.desired));
              setCurrent(String(p.current));
            }}
            className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold hover:bg-gold/10"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-offwhite">Desired strength (%)</label>
          <GlassInput inputMode="decimal" value={desired} onChange={(e) => setDesired(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-offwhite">Current concentration (%)</label>
          <GlassInput inputMode="decimal" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
      </div>
    </Calculator>
  );
}
