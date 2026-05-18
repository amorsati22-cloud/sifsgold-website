import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MasteryChart } from "@/components/study-guides/MasteryChart";
import { ReadinessGauge } from "@/components/state-board/ReadinessGauge";
import { CATEGORY_LABELS } from "@/lib/state-board/constants";
import { getStateBoardProgress, getStateBoardUser } from "@/lib/state-board/data";
import type { QuestionCategory } from "@/types/state-board";

export const metadata: Metadata = {
  title: "State board progress",
  robots: { index: false, follow: false },
};

type Props = { searchParams: { state?: string; program?: string } };

export default async function StateBoardProgressPage({ searchParams }: Props) {
  const { user } = await getStateBoardUser();
  if (!user) redirect("/sign-in?next=/dashboard/state-board-progress");

  const stateSlug = searchParams.state ?? "tx";
  const program = searchParams.program ?? "cosmetology";
  const progress = await getStateBoardProgress(user.id, stateSlug, program);

  const chartData = progress.categoryMastery.map((c) => ({
    name: CATEGORY_LABELS[c.category as QuestionCategory] ?? c.category,
    mastered: c.percent,
    total: 100,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl text-gold md:text-3xl">State board progress</h1>
        <p className="mt-2 text-sm text-cream/80">
          {progress.selectedExam?.exam_name ?? "Select a published exam"} — analytics from your practice
          attempts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Attempts" value={String(progress.totalAttempts)} />
        <Stat label="Average score" value={`${progress.averageScore}%`} />
        <Stat label="Best score" value={`${progress.bestScore}%`} />
        <Stat label="Study streak" value={`${progress.streakDays} days`} />
      </div>

      <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
        <h2 className="font-heading text-lg text-gold">Estimated readiness</h2>
        <div className="mt-4 flex justify-center">
          <ReadinessGauge percent={progress.readinessPercent} />
        </div>
      </section>

      <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
        <h2 className="font-heading text-lg text-gold">Mastery by category</h2>
        <div className="mt-4">
          <MasteryChart data={chartData} />
        </div>
      </section>

      {progress.weakestCategory ? (
        <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
          <h2 className="font-heading text-lg text-gold">Recommended next session</h2>
          <p className="mt-2 text-sm text-cream/85">
            Focus on{" "}
            <strong className="text-gold">
              {CATEGORY_LABELS[progress.weakestCategory]}
            </strong>{" "}
            — your lowest category score in recent attempts.
          </p>
          <Link
            href={`/state-board-prep/${stateSlug}/${program}/quiz?mode=category&category=${progress.weakestCategory}`}
            className="mt-4 inline-block rounded-full border border-gold bg-gold px-5 py-2 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Start category quiz
          </Link>
        </section>
      ) : null}

      <Link
        href={`/state-board-prep/${stateSlug}/${program}`}
        className="text-sm text-gold hover:underline"
      >
        ← Back to exam overview
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-4">
      <p className="text-xs uppercase tracking-widest text-cream/60">{label}</p>
      <p className="mt-2 font-heading text-2xl text-gold">{value}</p>
    </div>
  );
}
