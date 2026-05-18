"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculatePricingStrategy, type CityTier } from "@/lib/tools/formulas";

export function PricingStrategyClient() {
  const [years, setYears] = useState("3");
  const [tier, setTier] = useState<CityTier>("tier2");
  const [specialty, setSpecialty] = useState("Balayage");
  const [category, setCategory] = useState<"hair" | "skin" | "nails" | "lashes" | "barber" | "massage">("hair");

  const result = useMemo(
    () =>
      calculatePricingStrategy({
        yearsExperience: Number.parseFloat(years) || 0,
        cityTier: tier,
        specialty,
        category,
      }),
    [years, tier, specialty, category],
  );

  return (
    <Calculator
      toolName="pricing-strategy"
      getPresetData={() => ({ years, tier, specialty, category })}
      disclaimers={[
        result.citation,
        "Recommended price is a starting point for services — not guaranteed personal income.",
      ]}
      results={
        <div className="space-y-2">
          <p className="text-sm text-cream/70">Market range (annualized benchmark)</p>
          <p className="text-cream">
            ${result.marketLow.toLocaleString()} – ${result.marketHigh.toLocaleString()}
          </p>
          <p className="mt-3 text-sm text-cream/70">Recommended starting price (service anchor)</p>
          <p className="font-heading text-3xl text-gold">${result.recommendedStarting}</p>
          <p className="text-xs text-goldBody">~${result.hourlyEquivalent}/hr equivalent at 1,800 billable hrs/yr</p>
          <Link href="/career-paths/roles" className="mt-2 inline-block text-sm text-gold hover:underline">
            Compare BLS role medians →
          </Link>
        </div>
      }
    >
      <GlassInput value={years} onChange={(e) => setYears(e.target.value)} placeholder="Years experience" />
      <div>
        <label className="text-sm text-offwhite">Location tier</label>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as CityTier)}
          className="mt-1 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
        >
          <option value="tier1">Tier 1 — major metro (NYC, LA, Miami…)</option>
          <option value="tier2">Tier 2 — mid-size city</option>
          <option value="tier3">Tier 3 — smaller market</option>
        </select>
      </div>
      <GlassInput value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Specialty" />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as typeof category)}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-offwhite"
      >
        <option value="hair">Hair</option>
        <option value="barber">Barber</option>
        <option value="skin">Skin</option>
        <option value="nails">Nails</option>
        <option value="lashes">Lashes</option>
        <option value="massage">Massage</option>
      </select>
    </Calculator>
  );
}
