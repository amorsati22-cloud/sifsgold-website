"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateAppointmentTiming } from "@/lib/tools/formulas";

export function TimingCalculatorClient() {
  const [services, setServices] = useState([
    { name: "Consultation", minutes: 10 },
    { name: "Cut", minutes: 45 },
    { name: "Tone gloss", minutes: 20 },
  ]);
  const [buffer, setBuffer] = useState("15");

  const result = useMemo(
    () =>
      calculateAppointmentTiming(
        services,
        Number.parseFloat(buffer) || 0,
      ),
    [services, buffer],
  );

  const calendarUrl = `/dashboard/calendar?duration=${result.totalMinutes}`;

  return (
    <Calculator
      toolName="timing-calculator"
      getPresetData={() => ({ services, buffer })}
      results={
        <div>
          <p className="text-sm text-cream/70">Total block time</p>
          <p className="font-heading text-3xl text-gold">{result.blockLabel}</p>
          <p className="mt-2 text-sm text-cream/75">
            Services: {result.serviceMinutes}m + buffer: {result.bufferMinutes}m
          </p>
          <Link
            href={calendarUrl}
            className="mt-4 inline-block rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10"
          >
            Add to my calendar block
          </Link>
          <p className="mt-2 text-xs text-cream/50">Sign in to use your dashboard calendar.</p>
        </div>
      }
    >
      {services.map((s, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-2">
          <GlassInput
            value={s.name}
            onChange={(e) =>
              setServices((rows) =>
                rows.map((r, idx) => (idx === i ? { ...r, name: e.target.value } : r)),
              )
            }
          />
          <GlassInput
            inputMode="numeric"
            value={String(s.minutes)}
            onChange={(e) =>
              setServices((rows) =>
                rows.map((r, idx) =>
                  idx === i ? { ...r, minutes: Number.parseInt(e.target.value, 10) || 0 } : r,
                ),
              )
            }
            placeholder="Minutes"
          />
        </div>
      ))}
      <button
        type="button"
        className="text-xs text-gold hover:underline"
        onClick={() => setServices((r) => [...r, { name: "Add-on", minutes: 15 }])}
      >
        + Add service
      </button>
      <GlassInput value={buffer} onChange={(e) => setBuffer(e.target.value)} placeholder="Buffer %" />
    </Calculator>
  );
}
