"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateColorFormula } from "@/lib/tools/formulas";

const VOLUMES = [10, 20, 30, 40] as const;

export function ColorFormulaClient() {
  const [volume, setVolume] = useState<10 | 20 | 30 | 40>(20);
  const [brand, setBrand] = useState("Professional line");
  const [base, setBase] = useState("6N");
  const [target, setTarget] = useState("8G");

  const result = useMemo(
    () => calculateColorFormula({ developerVolume: volume, brand, baseColor: base, targetColor: target }),
    [volume, brand, base, target],
  );

  return (
    <Calculator
      toolName="color-formula"
      getPresetData={() => ({ volume, brand, base, target })}
      disclaimers={["Follow manufacturer SDS and strand tests — ratios here are educational estimates."]}
      results={
        <div className="space-y-3 text-sm">
          <p>
            <span className="text-cream/60">Mixing ratio: </span>
            <span className="font-medium text-gold">{result.mixingRatio}</span>
          </p>
          <p>
            <span className="text-cream/60">Processing time: </span>
            <span className="font-medium text-cream">~{result.processingMinutes} minutes</span>
          </p>
          <p className="text-cream/80">{result.notes}</p>
        </div>
      }
    >
      <div>
        <p className="text-sm font-medium text-offwhite">Developer volume</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {VOLUMES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVolume(v)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                volume === v ? "border-gold bg-gold text-navy" : "border-gold/40 text-gold"
              }`}
            >
              {v} vol
            </button>
          ))}
        </div>
      </div>
      <GlassInput value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Color brand" />
      <GlassInput value={base} onChange={(e) => setBase(e.target.value)} placeholder="Base level" />
      <GlassInput value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target tone" />
    </Calculator>
  );
}
