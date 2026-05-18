"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateBoothRentBreakeven } from "@/lib/tools/formulas";

export function BoothRentClient() {
  const [rent, setRent] = useState("1200");
  const [commission, setCommission] = useState("45");
  const [gross, setGross] = useState("6000");

  const result = useMemo(
    () =>
      calculateBoothRentBreakeven({
        monthlyRent: Number.parseFloat(rent) || 0,
        commissionPercent: Number.parseFloat(commission) || 0,
        monthlyGrossRevenue: Number.parseFloat(gross) || 0,
      }),
    [rent, commission, gross],
  );

  const betterLabel =
    result.betterModel === "rent"
      ? "Booth rent wins at your current gross"
      : result.betterModel === "commission"
        ? "Commission wins at your current gross"
        : "Roughly equal at your current gross";

  return (
    <Calculator
      toolName="booth-rent-calculator"
      getPresetData={() => ({ rent, commission, gross })}
      results={
        <div className="space-y-3 text-sm">
          <p className="font-heading text-lg text-gold">{betterLabel}</p>
          <p>Commission cost: ${result.commissionCost.toFixed(0)}/mo</p>
          <p>Booth rent: ${result.rentCost.toFixed(0)}/mo</p>
          <p className="text-goldBody">
            Breakeven gross (commission = rent): ${result.breakevenRevenue.toFixed(0)}/mo
          </p>
        </div>
      }
    >
      <GlassInput value={rent} onChange={(e) => setRent(e.target.value)} placeholder="Monthly booth rent ($)" />
      <GlassInput
        value={commission}
        onChange={(e) => setCommission(e.target.value)}
        placeholder="Commission % (if not renting)"
      />
      <GlassInput value={gross} onChange={(e) => setGross(e.target.value)} placeholder="Expected monthly gross ($)" />
    </Calculator>
  );
}
