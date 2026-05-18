"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completePracticeAttempt } from "@/lib/state-board/actions";
import { CATEGORY_LABELS } from "@/lib/state-board/constants";
import type { Question } from "@/types/state-board";

type Props = {
  questions: Question[];
  attemptId: string;
  examId: string;
  stateSlug: string;
  program: string;
  passingScore: number;
  modeLabel: string;
};

export function QuizPlayer({
  questions,
  attemptId,
  examId,
  stateSlug,
  program,
  passingScore,
  modeLabel,
}: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [started] = useState(() => Date.now());
  const [finished, setFinished] = useState<{
    score: number;
    passed: boolean;
    breakdown: Record<string, number>;
  } | null>(null);

  const q = questions[index];
  const total = questions.length;

  const submitAnswer = useCallback(() => {
    if (!q || !selected) return;
    setAnswers((prev) => ({ ...prev, [q.id]: selected }));
    setRevealed(true);
  }, [q, selected]);

  const next = useCallback(async () => {
    if (!q) return;
    if (index + 1 >= total) {
      const elapsed = Math.round((Date.now() - started) / 1000);
      const result = await completePracticeAttempt({
        attemptId,
        examId,
        stateSlug,
        program,
        answers: { ...answers, [q.id]: selected! },
        questionIds: questions.map((x) => x.id),
        timeElapsedSeconds: elapsed,
        passingScore,
      });
      setFinished({
        score: result.scorePercent,
        passed: result.passed,
        breakdown: result.breakdown,
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }, [answers, attemptId, examId, index, passingScore, program, q, questions, selected, started, stateSlug, total]);

  useEffect(() => {
    if (!q) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !revealed && selected) submitAnswer();
      if (e.key === "Enter" && revealed) void next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, q, revealed, selected, submitAnswer]);

  if (!q || total === 0) {
    return <p className="text-cream/80">No questions available.</p>;
  }

  if (finished) {
    const weak = Object.entries(finished.breakdown).sort((a, b) => a[1] - b[1])[0];
    return (
      <div className="rounded-brand-lg border border-gold/25 bg-navy-deep/80 p-8">
        <h2 className="font-heading text-2xl text-gold">{modeLabel} complete</h2>
        <p className="mt-2 text-4xl font-bold text-cream">{finished.score}%</p>
        <p className="mt-1 text-sm text-cream/70">
          Passing target: {passingScore}% — {finished.passed ? "On track" : "Keep studying"}
        </p>
        {weak ? (
          <p className="mt-4 text-sm text-goldBody">
            Weak area: {CATEGORY_LABELS[weak[0] as keyof typeof CATEGORY_LABELS] ?? weak[0]} (
            {Math.round(weak[1] * 100)}%)
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => router.push(`/state-board-prep/${stateSlug}/${program}`)}
          className="mt-6 rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Back to exam overview
        </button>
      </div>
    );
  }

  const choices =
    q.question_type === "true_false" || q.question_type === "flashcard"
      ? [
          { key: "true", label: "True" },
          { key: "false", label: "False" },
        ]
      : [
          { key: "A", label: q.choice_a ?? "" },
          { key: "B", label: q.choice_b ?? "" },
          { key: "C", label: q.choice_c ?? "" },
          { key: "D", label: q.choice_d ?? "" },
        ].filter((c) => c.label);

  return (
    <div className="space-y-6">
      <p className="text-xs text-goldBody">
        Question {index + 1} of {total} · {CATEGORY_LABELS[q.category]}
      </p>
      <p className="text-lg leading-relaxed text-cream">{q.question_text}</p>

      <fieldset className="space-y-2">
        <legend className="sr-only">Select an answer</legend>
        {choices.map((c) => (
          <label
            key={c.key}
            className={`flex cursor-pointer items-center gap-3 rounded-brand border px-4 py-3 text-sm transition ${
              selected === c.key
                ? "border-gold bg-gold/10 text-cream"
                : "border-gold/20 bg-navy-deep/60 text-cream/90 hover:border-gold/40"
            } ${revealed && q.correct_answer.toUpperCase() === c.key.toUpperCase() ? "ring-1 ring-emerald-500/60" : ""}`}
          >
            <input
              type="radio"
              name="answer"
              value={c.key}
              checked={selected === c.key}
              disabled={revealed}
              onChange={() => setSelected(c.key)}
              className="accent-gold"
            />
            <span>
              {q.question_type === "multiple_choice" ? `${c.key}. ` : ""}
              {c.label}
            </span>
          </label>
        ))}
      </fieldset>

      {revealed ? (
        <div className="rounded-brand border border-gold/20 bg-navy-deep/70 p-4 text-sm">
          <p className="font-semibold text-gold">Explanation</p>
          <p className="mt-2 text-cream/85">{q.explanation}</p>
          {q.citation ? <p className="mt-2 text-xs text-goldBody">Citation: {q.citation}</p> : null}
        </div>
      ) : null}

      <div className="flex gap-3">
        {!revealed ? (
          <button
            type="button"
            disabled={!selected}
            onClick={submitAnswer}
            className="rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Submit answer
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void next()}
            className="rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {index + 1 >= total ? "See results" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
