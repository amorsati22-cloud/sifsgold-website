"use client";

import { useMemo, useState } from "react";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateAppointmentRoi, calculateBulkAppointmentRoi } from "@/lib/tools/formulas";

export function AppointmentRoiClient() {
  const [price, setPrice] = useState("95");
  const [product, setProduct] = useState("8");
  const [minutes, setMinutes] = useState("60");
  const [overhead, setOverhead] = useState("30");
  const [bulk, setBulk] = useState(false);
  const [bulkRows, setBulkRows] = useState([
    { name: "Cut & style", servicePrice: 85, productCost: 6, minutes: 60, overheadPercent: 30 },
    { name: "Color", servicePrice: 150, productCost: 22, minutes: 120, overheadPercent: 30 },
    { name: "Blowout", servicePrice: 45, productCost: 2, minutes: 30, overheadPercent: 30 },
  ]);

  const single = useMemo(
    () =>
      calculateAppointmentRoi({
        servicePrice: Number.parseFloat(price) || 0,
        productCost: Number.parseFloat(product) || 0,
        minutes: Number.parseFloat(minutes) || 0,
        overheadPercent: Number.parseFloat(overhead) || 0,
      }),
    [price, product, minutes, overhead],
  );

  const bulkResult = useMemo(() => calculateBulkAppointmentRoi(bulkRows), [bulkRows]);

  return (
    <Calculator
      toolName="appointment-roi"
      getPresetData={() => (bulk ? { bulkRows } : { price, product, minutes, overhead })}
      disclaimers={["Profit estimates exclude taxes, benefits, and chair guarantees."]}
      results={
        bulk ? (
          <ul className="space-y-3 text-sm">
            {bulkResult
              .sort((a, b) => b.profitPerHour - a.profitPerHour)
              .map((r) => (
                <li key={r.name} className="flex justify-between border-b border-gold/10 pb-2">
                  <span>{r.name}</span>
                  <span className="text-gold">${r.profitPerHour.toFixed(0)}/hr net</span>
                </li>
              ))}
          </ul>
        ) : (
          <div>
            <p className="text-sm text-cream/75">Net profit</p>
            <p className="font-heading text-3xl text-gold">${single.netProfit.toFixed(2)}</p>
            <p className="mt-2 text-sm text-cream/75">
              Per hour: <span className="text-gold">${single.profitPerHour.toFixed(2)}</span>
            </p>
          </div>
        )
      }
    >
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={bulk} onChange={(e) => setBulk(e.target.checked)} className="accent-gold" />
        Run for all services (bulk compare)
      </label>
      {!bulk ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <GlassInput value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Service price" />
          <GlassInput value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Product cost" />
          <GlassInput value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Minutes" />
          <GlassInput value={overhead} onChange={(e) => setOverhead(e.target.value)} placeholder="Overhead %" />
        </div>
      ) : (
        <p className="text-xs text-cream/60">Sample menu — edit values in a future release; compare relative ROI.</p>
      )}
    </Calculator>
  );
}
