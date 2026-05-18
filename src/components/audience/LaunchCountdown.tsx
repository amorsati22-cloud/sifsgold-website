"use client";

import { daysUntilLaunch, isLive, type LaunchIndustry } from "@/lib/launch-dates";

const COUNTDOWN_COPY: Record<LaunchIndustry, string> = {
  beauty: "until beauty industry launches",
  fashion: "until fashion industry launches",
};

export function LaunchCountdown({ industry }: { industry: LaunchIndustry }) {
  if (isLive(industry)) {
    return null;
  }

  const days = daysUntilLaunch(industry);

  return (
    <div
      className="mt-8 rounded-brand-lg border border-gold/25 bg-navy-deep/60 px-6 py-5 text-center backdrop-blur-sm"
      aria-live="polite"
    >
      <p className="font-mono text-5xl font-bold tabular-nums text-gold md:text-6xl">{days}</p>
      <p className="mt-2 font-body text-sm text-cream/85">
        {days === 1 ? "day" : "days"} {COUNTDOWN_COPY[industry]}
      </p>
    </div>
  );
}
