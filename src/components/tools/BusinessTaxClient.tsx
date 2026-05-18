"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateBusinessTax } from "@/lib/tools/formulas";

export function BusinessTaxClient() {
  const [gross, setGross] = useState("85000");
  const [expenses, setExpenses] = useState("22000");

  const result = useMemo(
    () =>
      calculateBusinessTax({
        grossRevenue: Number.parseFloat(gross) || 0,
        businessExpenses: Number.parseFloat(expenses) || 0,
      }),
    [gross, expenses],
  );

  return (
    <Calculator
      toolName="business-tax-estimator"
      getPresetData={() => ({ gross, expenses })}
      disclaimers={[
        "Consult a CPA — this is an estimate only using simplified federal rates (SE + income).",
        "State and local taxes, deductions, and QBI are not modeled.",
      ]}
      results={
        <div className="space-y-2">
          <p className="text-sm text-cream/70">Estimated annual tax</p>
          <p className="font-heading text-3xl text-gold">${result.totalEstimated.toFixed(0)}</p>
          <p className="text-sm text-cream/80">
            Quarterly payment (estimate):{" "}
            <span className="text-gold">${result.quarterlyPayment.toFixed(0)}</span>
          </p>
          <p className="text-xs text-cream/55">
            Net profit basis: ${result.netProfit.toFixed(0)} (SE ${result.seTax.toFixed(0)} + income tax $
            {result.incomeTax.toFixed(0)})
          </p>
        </div>
      }
    >
      <GlassInput value={gross} onChange={(e) => setGross(e.target.value)} placeholder="Gross revenue (annual)" />
      <GlassInput
        value={expenses}
        onChange={(e) => setExpenses(e.target.value)}
        placeholder="Business expenses (annual)"
      />
    </Calculator>
  );
}
