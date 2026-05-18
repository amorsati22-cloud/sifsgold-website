"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator } from "@/components/tools/Calculator";
import { GlassInput } from "@/components/ui/GlassInput";
import { calculateStateBoardCountdown } from "@/lib/tools/formulas";

export function StateBoardCountdownClient() {
  const [examDate, setExamDate] = useState("2026-09-15");
  const [hoursLeft, setHoursLeft] = useState("120");

  const result = useMemo(
    () =>
      calculateStateBoardCountdown({
        examDateIso: examDate,
        studyHoursRemaining: Number.parseFloat(hoursLeft) || 0,
      }),
    [examDate, hoursLeft],
  );

  return (
    <Calculator
      toolName="state-board-countdown"
      getPresetData={() => ({ examDate, hoursLeft })}
      results={
        <div>
          {result.pastDue ? (
            <p className="text-gold">Exam date has passed — update your target or celebrate passing!</p>
          ) : (
            <>
              <p className="text-sm text-cream/70">Days until exam</p>
              <p className="font-heading text-4xl text-gold">{result.daysRemaining}</p>
              <p className="mt-3 text-sm text-cream/80">
                Study target: ~{result.hoursPerDay} hours/day to cover {hoursLeft} remaining hours
              </p>
            </>
          )}
          <Link
            href="/study-guides"
            className="mt-4 inline-block text-sm font-semibold text-gold hover:underline"
          >
            Open study guides →
          </Link>
          <Link
            href="/state-board-prep"
            className="ml-4 inline-block text-sm font-semibold text-gold hover:underline"
          >
            State board prep →
          </Link>
        </div>
      }
    >
      <GlassInput type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
      <GlassInput
        value={hoursLeft}
        onChange={(e) => setHoursLeft(e.target.value)}
        placeholder="Study hours remaining"
      />
    </Calculator>
  );
}
