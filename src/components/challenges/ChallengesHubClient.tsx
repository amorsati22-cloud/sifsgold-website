"use client";

import { useMemo, useState } from "react";
import { ChallengeGrid } from "@/components/challenges/ChallengeGrid";
import type { BeautyChallenge, ChallengeType } from "@/types/challenges-feed";

export function ChallengesHubClient({
  challenges,
  joinedIds,
  showArchive,
}: {
  challenges: BeautyChallenge[];
  joinedIds: string[];
  showArchive?: boolean;
}) {
  const [type, setType] = useState<ChallengeType | "all">("all");
  const joined = useMemo(() => new Set(joinedIds), [joinedIds]);

  const filtered = useMemo(() => {
    if (type === "all") return challenges;
    return challenges.filter((c) => c.challenge_type === type);
  }, [challenges, type]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["all", "self_care", "skill_building", "creative", "community"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-full border px-3 py-1 text-xs ${
              type === t ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
            }`}
          >
            {t === "all" ? "All" : t.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <ChallengeGrid challenges={filtered} joinedIds={joined} />
      {showArchive ? (
        <p className="text-xs text-cream/55">Past challenges celebrate participation — no weight-loss framing.</p>
      ) : null}
    </div>
  );
}
