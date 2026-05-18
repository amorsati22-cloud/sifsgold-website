"use client";

import Link from "next/link";
import { CHALLENGE_TYPE_LABELS } from "@/lib/challenges/constants";
import type { BeautyChallenge } from "@/types/challenges-feed";

export function ChallengeGrid({
  challenges,
  joinedIds,
}: {
  challenges: BeautyChallenge[];
  joinedIds: Set<string>;
}) {
  if (challenges.length === 0) {
    return <p className="text-cream/70">No challenges match this filter.</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((c) => (
        <li key={c.id}>
          <Link
            href={`/challenges/${c.id}`}
            className="flex h-full flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 hover:border-gold/40"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs uppercase tracking-widest text-goldBody">
                {CHALLENGE_TYPE_LABELS[c.challenge_type]}
              </span>
              {joinedIds.has(c.id) ? (
                <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-semibold text-teal">
                  Joined
                </span>
              ) : null}
            </div>
            <p className="mt-2 font-heading text-lg text-gold">{c.name}</p>
            <p className="mt-2 flex-1 text-sm text-cream/75 line-clamp-3">{c.description}</p>
            <p className="mt-3 text-xs text-cream/55">
              {c.duration_days} days · {c.participant_count} participants
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
