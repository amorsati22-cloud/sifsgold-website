"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL_STATE_SLUGS, STATE_BOARD_STUBS } from "@/data/states";
import { NotifyMeForm } from "@/components/state-board/NotifyMeForm";
import { PROGRAM_LABELS } from "@/lib/state-board/constants";
import type { ProgramType } from "@/types/state-board";

const PROGRAMS: ProgramType[] = ["cosmetology", "barbering", "esthetics", "nail_tech"];

type ExamRow = {
  stateSlug: string;
  stateName: string;
  program: ProgramType;
  published: boolean;
  totalQuestions: number;
  bestScore: number | null;
};

export function StateBoardHub({
  exams,
  userEmail,
}: {
  exams: ExamRow[];
  userEmail?: string;
}) {
  const [stateSlug, setStateSlug] = useState("tx");
  const [program, setProgram] = useState<ProgramType>("cosmetology");

  const stub = STATE_BOARD_STUBS[stateSlug as keyof typeof STATE_BOARD_STUBS];
  const row = useMemo(
    () => exams.find((e) => e.stateSlug === stateSlug && e.program === program),
    [exams, stateSlug, program],
  );

  const published = row?.published ?? false;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-xs text-cream/70">
          State
          <select
            value={stateSlug}
            onChange={(e) => setStateSlug(e.target.value)}
            className="min-w-[200px] rounded-brand border border-gold/30 bg-navy-deep px-3 py-2 text-sm text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {[...ALL_STATE_SLUGS].sort().map((slug) => (
              <option key={slug} value={slug}>
                {STATE_BOARD_STUBS[slug]?.displayName ?? slug.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-cream/70">
          Program
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value as ProgramType)}
            className="min-w-[200px] rounded-brand border border-gold/30 bg-navy-deep px-3 py-2 text-sm text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>
                {PROGRAM_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold/90">
          {stub?.displayName ?? stateSlug.toUpperCase()} · {PROGRAM_LABELS[program]}
        </p>
        <h2 className="mt-2 font-heading text-2xl text-gold">
          {published ? "Published question bank" : "Coming soon"}
        </h2>
        {published ? (
          <>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-cream/60">Questions</dt>
                <dd className="font-medium text-cream">{row?.totalQuestions ?? 300}</dd>
              </div>
              <div>
                <dt className="text-cream/60">Your best score</dt>
                <dd className="font-medium text-gold">
                  {row?.bestScore != null ? `${row.bestScore}%` : "Not attempted yet"}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/state-board-prep/${stateSlug}/${program}`}
                className="inline-flex rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Open exam hub
              </Link>
              <Link
                href={`/state-board-prep/${stateSlug}/${program}/full-exam`}
                className="inline-flex rounded-full border border-gold/50 px-6 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Start practice test
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 max-w-2xl text-sm text-cream/80">
              Coming soon — sign up for notification. We ship state-specific banks only (hours, vendor,
              passing score, and statute citations verified per board).
            </p>
            <NotifyMeForm stateSlug={stateSlug} program={program} defaultEmail={userEmail} />
          </>
        )}
      </section>

      <section>
        <h2 className="font-heading text-xl text-gold">All states</h2>
        <ul className="mt-4 grid list-none gap-2 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...ALL_STATE_SLUGS].sort().map((slug) => {
            const name = STATE_BOARD_STUBS[slug]?.displayName ?? slug;
            const live = exams.some((e) => e.stateSlug === slug && e.program === "cosmetology" && e.published);
            return (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => setStateSlug(slug)}
                  className={`w-full rounded-brand border px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    slug === stateSlug
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/15 bg-navy-deep/50 text-cream/85 hover:border-gold/35"
                  }`}
                >
                  {name}
                  {live ? (
                    <span className="ml-2 text-xs text-emerald-400">Live</span>
                  ) : (
                    <span className="ml-2 text-xs text-cream/50">Soon</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
