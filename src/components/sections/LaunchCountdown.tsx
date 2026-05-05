"use client";

import { useEffect, useMemo, useState } from "react";
import { BRAND } from "@/lib/constants";

function getRemaining(targetMs: number) {
  const now = Date.now();
  const diff = Math.max(0, targetMs - now);
  const sec = Math.floor(diff / 1000);
  return {
    days: Math.floor(sec / 86400),
    hours: Math.floor((sec % 86400) / 3600),
    minutes: Math.floor((sec % 3600) / 60),
    seconds: sec % 60,
  };
}

export type LaunchCountdownProps = {
  /** ISO 8601 local/UTC string, e.g. `2026-06-30T00:00:00` */
  targetDate?: string;
  title?: string;
  /** Pass `null` to hide the footnote */
  footnote?: string | null;
};

export function LaunchCountdown({
  targetDate = BRAND.launchDate,
  title = "Days Until Launch",
  footnote = "Founding member pricing ends at launch",
}: LaunchCountdownProps) {
  const targetMs = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [parts, setParts] = useState(() => getRemaining(targetMs));

  useEffect(() => {
    setParts(getRemaining(targetMs));
  }, [targetMs]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setParts(getRemaining(targetMs));
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const cells = [
    { value: parts.days, label: "Days", pad: false as const },
    { value: parts.hours, label: "Hours", pad: true as const },
    { value: parts.minutes, label: "Minutes", pad: true as const },
    { value: parts.seconds, label: "Seconds", pad: true as const },
  ] as const;

  return (
    <section className="bg-navy-dark py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-heading text-2xl text-gold">{title}</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-4">
          {cells.map((cell) => (
            <div key={cell.label} className="flex flex-col items-center">
              <span className="font-mono text-5xl text-white tabular-nums">
                {cell.pad ? String(cell.value).padStart(2, "0") : String(cell.value)}
              </span>
              <span className="mt-2 text-sm text-white/40">{cell.label}</span>
            </div>
          ))}
        </div>
        {footnote != null && footnote !== "" ? (
          <p className="mt-10 text-sm text-white/40">{footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
