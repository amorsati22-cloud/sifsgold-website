import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";

export const metadata: Metadata = {
  title: "For Beauty Students | Sif's Gold",
  description:
    "State board exam prep, hour tracking, peer study tools, and your Bridge to licensure — all in one platform.",
};

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
      {children}
    </span>
  );
}

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <SectionBadge>For Beauty Students</SectionBadge>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Pass your boards. Launch your career.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            State board exam prep, hour tracking, peer study tools, and your
            Bridge to licensure — all in one platform.
          </p>
          <div className="mt-10">
            <Link
              href="#waitlist"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gold px-8 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:w-auto"
            >
              Join the waitlist
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10 bg-navy-light/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built around your state&apos;s actual exam.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
            Every question bank is built state-by-state from official state
            board exam content — correct training hours, exam vendor, passing
            score, and statute citations for your specific state. Not generic
            cosmetology trivia.
          </p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-navy-dark/50 p-6">
            <h3 className="font-semibold text-offwhite">Board Weather</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Your personal forecast moves as you study — five bands from
              Stormy through Gold Standard — so you always know how exam-ready
              you really are.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(
                [
                  "Stormy",
                  "Overcast",
                  "Fair",
                  "Strong",
                  "Gold Standard",
                ] as const
              ).map((band, i) => (
                <span
                  key={band}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    i === 4
                      ? "bg-gold text-navy"
                      : "border border-white/20 bg-navy-light/40 text-offwhite"
                  }`}
                >
                  {band}
                </span>
              ))}
            </div>
          </div>
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <li className="rounded-2xl border border-white/10 bg-navy-dark/50 p-6">
              <h3 className="font-semibold text-offwhite">Category Knockout</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Drill weak domains in a bracket-style game until only your
                strongest categories remain.
              </p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-navy-dark/50 p-6">
              <h3 className="font-semibold text-offwhite">The Anvil</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Peer duels with classmates — quick head-to-head rounds that turn
                review into competition you actually want to do.
              </p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-navy-dark/50 p-6">
              <h3 className="font-semibold text-offwhite">Board Boss Battle</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Face a final-boss style capstone that mixes topics the way your
                real exam does — stamina and strategy, not isolated memorization.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: "50 States", label: "Question banks being built" },
            {
              stat: "100 MCQ + 50 T/F + 100 Flashcards",
              label: "Per state",
            },
            { stat: "Board Ready %", label: "Your personal readiness score" },
            { stat: "8 Study Games", label: "Built for board prep" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-navy-light/30 p-6"
            >
              <p className="text-xl font-semibold tracking-tight text-gold sm:text-2xl">
                {item.stat}
              </p>
              <p className="mt-2 text-sm leading-snug text-white/70">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Graduation is not the finish line.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-white/70">
            The Bridge activates the moment you pass your boards. Your student
            profile converts to a professional profile. Your Clock In hours
            become your experience record. Your classmates become your
            community. The transition is built into the platform.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-navy-light/15 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Learn through play, not just memorization.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-white/70">
            Eight study games anchor board prep — here are six of the modes
            students use every week.
          </p>
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Board Weather",
                body: "Watch your readiness move from Stormy through Overcast, Fair, and Strong, up to Gold Standard as you master your state blueprint.",
              },
              {
                title: "Category Knockout",
                body: "Eliminate weak categories round by round until your study plan reflects what the board will actually weight.",
              },
              {
                title: "The Anvil",
                body: "Challenge peers in timed duels — same item pool, same clock, instant feedback on who locked in the right answer first.",
              },
              {
                title: "Board Boss Battle",
                body: "A multi-stage exam-style gauntlet that forces you to switch topics the way the real test does.",
              },
              {
                title: "Flashcard Relay",
                body: "High-volume flashcard sprints tied to your state deck — built for muscle memory on definitions, rules, and safety.",
              },
              {
                title: "Statute Seek",
                body: "Match scenario prompts to the citation that matters in your state — trains recall for exam language, not generic tips.",
              },
            ].map((game) => (
              <li
                key={game.title}
                className="rounded-2xl border border-white/10 bg-navy-dark/50 p-6"
              >
                <h3 className="text-lg font-semibold text-offwhite">
                  {game.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {game.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-sm text-white/50">
            Plus two more game modes ship with every state pack — all eight tie
            into your Board Ready %.
          </p>
        </div>
      </section>

      <WaitlistForm heading="Join students prepping for their boards." />
    </div>
  );
}
