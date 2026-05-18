import type { Metadata } from "next";
import Link from "next/link";
import { ReadinessGauge } from "@/components/state-board/ReadinessGauge";
import { CATEGORY_LABELS } from "@/lib/state-board/constants";
import { getStudentBoardPrep } from "@/lib/schools/data";
import { requireEnrolledStudent } from "@/lib/schools/require-student";
import { stateSlugFromCode } from "@/lib/state-board/data";
import { getStateBoardProgress } from "@/lib/state-board/data";
import type { QuestionCategory } from "@/types/state-board";

export const metadata: Metadata = {
  title: "State board prep",
  robots: { index: false, follow: false },
};

export default async function StudentStateBoardPrepPage() {
  const { student, cohort, user } = await requireEnrolledStudent();
  const slug = stateSlugFromCode(cohort.state);
  const [boardPrep, progress] = await Promise.all([
    getStudentBoardPrep(student.id, cohort.state, cohort.program_type),
    getStateBoardProgress(user.id, slug, cohort.program_type),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl text-gold">State board prep</h1>
        <p className="mt-1 font-body text-sm text-cream/80 capitalize">
          {cohort.state} {cohort.program_type}
        </p>
      </header>

      <section className="rounded-brand-lg border border-gold/15 p-6">
        <div className="flex flex-wrap items-center gap-8">
          <ReadinessGauge percent={progress.readinessPercent} />
          <div>
            <p className="font-body text-sm text-gold-body">
              {boardPrep.questionsAnswered} / {boardPrep.totalQuestions} questions in bank
            </p>
            <p className="font-body text-sm text-cream">Best score: {progress.bestScore}%</p>
            <p className="font-body text-sm text-cream">Attempts: {progress.totalAttempts}</p>
          </div>
        </div>
      </section>

      {progress.weakestCategory ? (
        <section className="rounded-brand-lg border border-gold/20 bg-gold/10 p-4">
          <h2 className="font-heading text-lg text-gold">Focus area</h2>
          <p className="mt-2 font-body text-sm text-cream/85">
            {CATEGORY_LABELS[progress.weakestCategory as QuestionCategory]}
          </p>
          <Link
            href={`/state-board-prep/${slug}/${cohort.program_type}/quiz?mode=category&category=${progress.weakestCategory}`}
            className="mt-3 inline-block rounded-full bg-gold px-5 py-2 font-body text-sm font-semibold text-navy"
          >
            Category quiz
          </Link>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/state-board-prep/${slug}/${cohort.program_type}/quiz`}
          className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy"
        >
          Quick quiz
        </Link>
        <Link
          href={`/state-board-prep/${slug}/${cohort.program_type}/full-exam`}
          className="rounded-brand-sm border border-gold/30 px-4 py-2 font-body text-sm text-gold"
        >
          Full practice exam
        </Link>
        <Link
          href="/dashboard/state-board-progress"
          className="rounded-brand-sm border border-gold/30 px-4 py-2 font-body text-sm text-gold-body"
        >
          Detailed analytics
        </Link>
      </div>
    </div>
  );
}
