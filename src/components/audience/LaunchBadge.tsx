"use client";

import { formatLaunchDate, isLive, type LaunchIndustry } from "@/lib/launch-dates";

export function LaunchBadge({ industry }: { industry: LaunchIndustry }) {
  const live = isLive(industry);

  if (live) {
    return (
      <p className="inline-flex rounded-full border border-teal/50 bg-teal/10 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-cream">
        Live now
      </p>
    );
  }

  return (
    <p className="inline-flex rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-gold">
      Launching {formatLaunchDate(industry)}
    </p>
  );
}
