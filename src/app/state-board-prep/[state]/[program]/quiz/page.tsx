import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { QuizPlayer } from "@/components/state-board/QuizPlayer";
import { CategoryQuizPicker } from "@/components/state-board/CategoryQuizPicker";
import { startPracticeAttempt } from "@/lib/state-board/actions";
import {
  getExam,
  getStateBoardUser,
  isPublishedCombo,
} from "@/lib/state-board/data";
import type { QuestionCategory, QuizMode } from "@/types/state-board";
import { STATE_BOARD_STUBS } from "@/data/states";

export const metadata: Metadata = {
  title: "Quiz session",
  robots: { index: false, follow: false },
};

type Props = {
  params: { state: string; program: string };
  searchParams: { mode?: string; category?: string };
};

export default async function QuizPage({ params, searchParams }: Props) {
  if (!isPublishedCombo(params.state, params.program)) {
    redirect(`/state-board-prep/${params.state}/${params.program}`);
  }

  const exam = await getExam(params.state, params.program);
  if (!exam) redirect("/state-board-prep");

  const mode = (searchParams.mode ?? "quick") as QuizMode;
  const category = searchParams.category as QuestionCategory | undefined;

  if (mode === "category" && !category) {
    const stub = STATE_BOARD_STUBS[params.state as keyof typeof STATE_BOARD_STUBS];
    return (
      <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6 md:px-8">
          <h1 className="font-heading text-2xl text-gold">Category focus</h1>
          <p className="mt-2 text-sm text-cream/80">Choose a category for 20 {stub?.displayName}-specific questions.</p>
          <CategoryQuizPicker stateSlug={params.state} program={params.program} />
        </div>
      </article>
    );
  }

  const started = await startPracticeAttempt({
    examId: exam.id,
    mode,
    category,
  });

  if (!started.ok) {
    redirect(`/sign-in?next=/state-board-prep/${params.state}/${params.program}/quiz?mode=${mode}`);
  }

  const modeLabel =
    mode === "quick"
      ? "Quick quiz"
      : mode === "category"
        ? `Category: ${category}`
        : "Practice";

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "State board prep", href: "/state-board-prep" },
          {
            name: exam.exam_name,
            href: `/state-board-prep/${params.state}/${params.program}`,
          },
          { name: modeLabel, href: "#" },
        ]}
      />
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 md:px-8">
        <QuizPlayer
          questions={started.questions}
          attemptId={started.attemptId}
          examId={exam.id}
          stateSlug={params.state}
          program={params.program}
          passingScore={exam.passing_score}
          modeLabel={modeLabel}
        />
      </div>
    </article>
  );
}
