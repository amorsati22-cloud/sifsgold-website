"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateTipSplit } from "@/lib/tools/formulas";

const TIP_PRESETS = [15, 18, 20, 22, 25] as const;

export function TipCalculatorClient() {
  const [serviceTotal, setServiceTotal] = useState("120");
  const [tipPct, setTipPct] = useState(20);
  const [customTip, setCustomTip] = useState("");
  const [members, setMembers] = useState([
    { name: "Stylist", sharePercent: 60 },
    { name: "Assistant", sharePercent: 40 },
  ]);

  const effectiveTip = customTip ? Number.parseFloat(customTip) || tipPct : tipPct;

  const result = useMemo(
    () =>
      calculateTipSplit({
        serviceTotal: Number.parseFloat(serviceTotal) || 0,
        tipPercent: effectiveTip,
        members,
      }),
    [serviceTotal, effectiveTip, members],
  );

  function updateMember(i: number, field: "name" | "sharePercent", value: string) {
    setMembers((m) =>
      m.map((row, idx) =>
        idx === i
          ? {
              ...row,
              [field]: field === "sharePercent" ? Number.parseFloat(value) || 0 : value,
            }
          : row,
      ),
    );
  }

  return (
    <Calculator
      toolName="tip-calculator"
      getPresetData={() => ({ serviceTotal, tipPct: effectiveTip, members })}
      disclaimers={["Tip splits are estimates — confirm pooling policies with your salon."]}
      results={
        <div className="space-y-4">
          <p className="text-sm text-cream/75">Total tip</p>
          <p className="font-heading text-3xl text-gold">${result.tipAmount.toFixed(2)}</p>
          <p className="text-sm text-cream/75">Service + tip</p>
          <p className="font-heading text-2xl text-cream">${result.totalWithTip.toFixed(2)}</p>
          <ul className="mt-4 space-y-2 border-t border-gold/15 pt-4">
            {result.perPerson.map((p) => (
              <li key={p.name} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-gold">${p.totalTakeHome.toFixed(2)} take-home</span>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-offwhite" htmlFor="svc-total">
          Service total (USD)
        </label>
        <GlassInput
          id="svc-total"
          inputMode="decimal"
          value={serviceTotal}
          onChange={(e) => setServiceTotal(e.target.value)}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-offwhite">Tip %</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TIP_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setTipPct(n);
                setCustomTip("");
              }}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                effectiveTip === n && !customTip
                  ? "border-gold bg-gold text-navy"
                  : "border-gold/40 text-gold hover:bg-gold/10"
              }`}
            >
              {n}%
            </button>
          ))}
        </div>
        <GlassInput
          className="mt-3"
          inputMode="decimal"
          placeholder="Custom %"
          value={customTip}
          onChange={(e) => setCustomTip(e.target.value)}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-offwhite">Team split (%)</p>
        {members.map((m, i) => (
          <div key={i} className="mt-2 grid gap-2 sm:grid-cols-2">
            <GlassInput
              value={m.name}
              onChange={(e) => updateMember(i, "name", e.target.value)}
              placeholder="Name"
            />
            <GlassInput
              inputMode="decimal"
              value={String(m.sharePercent)}
              onChange={(e) => updateMember(i, "sharePercent", e.target.value)}
              placeholder="% share"
            />
          </div>
        ))}
        <button
          type="button"
          className="mt-2 text-xs text-gold hover:underline"
          onClick={() => setMembers((m) => [...m, { name: "Team", sharePercent: 0 }])}
        >
          + Add team member
        </button>
      </div>
    </Calculator>
  );
}
