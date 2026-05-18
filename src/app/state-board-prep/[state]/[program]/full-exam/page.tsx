import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FullExamPlayer } from "@/components/state-board/FullExamPlayer";
import { startPracticeAttempt } from "@/lib/state-board/actions";
import { getExam, isPublishedCombo } from "@/lib/state-board/data";

export const metadata: Metadata = {
  title: "Full practice exam",
  robots: { index: false, follow: false },
};

type Props = { params: { state: string; program: string } };

export default async function FullExamPage({ params }: Props) {
  if (!isPublishedCombo(params.state, params.program)) {
    redirect(`/state-board-prep/${params.state}/${params.program}`);
  }

  const exam = await getExam(params.state, params.program);
  if (!exam) redirect("/state-board-prep");

  const started = await startPracticeAttempt({
    examId: exam.id,
    mode: "full",
  });

  if (!started.ok) {
    redirect(
      `/sign-in?next=/state-board-prep/${params.state}/${params.program}/full-exam`,
    );
  }

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "State board prep", href: "/state-board-prep" },
          {
            name: exam.exam_name,
            href: `/state-board-prep/${params.state}/${params.program}`,
          },
          { name: "Full exam", href: "#" },
        ]}
      />
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 md:px-8">
        <h1 className="font-heading text-2xl text-gold">Full practice exam</h1>
        <p className="mt-2 text-sm text-cream/75">
          {started.questions.length} questions · {exam.time_limit_minutes} minutes · {exam.passing_score}%
          required to pass
        </p>
        <div className="mt-8">
          <FullExamPlayer
            questions={started.questions}
            attemptId={started.attemptId}
            examId={exam.id}
            stateSlug={params.state}
            program={params.program}
            passingScore={exam.passing_score}
            timeLimitMinutes={exam.time_limit_minutes}
          />
        </div>
      </div>
    </article>
  );
}
