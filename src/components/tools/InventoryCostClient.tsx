"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateInventoryCost } from "@/lib/tools/formulas";

export function InventoryCostClient() {
  const [size, setSize] = useState("1000");
  const [cost, setCost] = useState("48");
  const [usage, setUsage] = useState("30");
  const [markup, setMarkup] = useState("200");

  const result = useMemo(
    () =>
      calculateInventoryCost({
        bottleSizeMl: Number.parseFloat(size) || 0,
        bottleCost: Number.parseFloat(cost) || 0,
        usagePerServiceMl: Number.parseFloat(usage) || 0,
        targetMarkupPercent: Number.parseFloat(markup) || 0,
      }),
    [size, cost, usage, markup],
  );

  return (
    <Calculator
      toolName="inventory-cost"
      getPresetData={() => ({ size, cost, usage, markup })}
      results={
        <div className="space-y-2 text-sm">
          <p>
            Cost per service: <span className="text-gold">${result.costPerService.toFixed(2)}</span>
          </p>
          <p>Services per bottle: ~{result.servicesPerBottle.toFixed(1)}</p>
          <p>
            Suggested service charge (product only):{" "}
            <span className="font-heading text-xl text-gold">
              ${result.suggestedServiceCharge.toFixed(2)}
            </span>
          </p>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <GlassInput value={size} onChange={(e) => setSize(e.target.value)} placeholder="Bottle size (ml)" />
        <GlassInput value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Bottle cost ($)" />
        <GlassInput value={usage} onChange={(e) => setUsage(e.target.value)} placeholder="Usage per service (ml)" />
        <GlassInput value={markup} onChange={(e) => setMarkup(e.target.value)} placeholder="Markup %" />
      </div>
    </Calculator>
  );
}
