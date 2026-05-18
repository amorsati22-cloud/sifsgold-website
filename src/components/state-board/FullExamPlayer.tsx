"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  timeLimitMinutes: number;
};

export function FullExamPlayer({
  questions,
  attemptId,
  examId,
  stateSlug,
  program,
  passingScore,
  timeLimitMinutes,
}: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [started] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    breakdown: Record<string, number>;
  } | null>(null);

  const q = questions[index];

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          void handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    const elapsed = timeLimitMinutes * 60 - secondsLeft;
    const res = await completePracticeAttempt({
      attemptId,
      examId,
      stateSlug,
      program,
      answers,
      questionIds: questions.map((x) => x.id),
      timeElapsedSeconds: elapsed > 0 ? elapsed : Math.round((Date.now() - started) / 1000),
      passingScore,
    });
    setResult({ score: res.scorePercent, passed: res.passed, breakdown: res.breakdown });
  }, [
    answers,
    attemptId,
    examId,
    passingScore,
    program,
    questions,
    secondsLeft,
    started,
    stateSlug,
    submitted,
    timeLimitMinutes,
  ]);

  const timerLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  if (result) {
    const weak = Object.entries(result.breakdown).sort((a, b) => a[1] - b[1])[0];
    return (
      <div className="space-y-6 rounded-brand-lg border border-gold/25 bg-navy-deep/80 p-8">
        <h2 className="font-heading text-2xl text-gold">
          {result.passed ? "Passing range" : "Below passing — keep drilling"}
        </h2>
        <p className="text-4xl font-bold text-cream">{result.score}%</p>
        <p className="text-sm text-cream/70">
          Required: {passingScore}% · Time limit was {timeLimitMinutes} minutes
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {Object.entries(result.breakdown).map(([cat, pct]) => (
            <li key={cat} className="flex justify-between gap-4 text-cream/85">
              <span>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}</span>
              <span className="text-gold">{Math.round(pct * 100)}%</span>
            </li>
          ))}
        </ul>
        {weak ? (
          <p className="text-sm text-goldBody">
            Focus next: {CATEGORY_LABELS[weak[0] as keyof typeof CATEGORY_LABELS]} (
            {Math.round(weak[1] * 100)}%)
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => router.push(`/state-board-prep/${stateSlug}/${program}`)}
          className="rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Back to overview
        </button>
      </div>
    );
  }

  if (!q) return null;

  const choices =
    q.question_type === "multiple_choice"
      ? [
          { key: "A", label: q.choice_a ?? "" },
          { key: "B", label: q.choice_b ?? "" },
          { key: "C", label: q.choice_c ?? "" },
          { key: "D", label: q.choice_d ?? "" },
        ]
      : [
          { key: "true", label: "True" },
          { key: "false", label: "False" },
        ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-goldBody">
            Question {index + 1} / {questions.length}
          </p>
          <p
            className={`font-mono text-sm font-semibold ${secondsLeft < 300 ? "text-red-300" : "text-gold"}`}
            aria-live="polite"
          >
            {timerLabel}
          </p>
        </div>
        <p className="text-lg text-cream">{q.question_text}</p>
        <fieldset className="space-y-2">
          <legend className="sr-only">Answer</legend>
          {choices.map((c) => (
            <label
              key={c.key}
              className={`flex cursor-pointer items-center gap-3 rounded-brand border px-4 py-3 text-sm ${
                answers[q.id] === c.key
                  ? "border-gold bg-gold/10"
                  : "border-gold/20 bg-navy-deep/60"
              }`}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === c.key}
                onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: c.key }))}
                className="accent-gold"
              />
              <span>
                {q.question_type === "multiple_choice" ? `${c.key}. ` : ""}
                {c.label}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={index >= questions.length - 1}
            className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold disabled:opacity-40"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() =>
              setFlagged((prev) => {
                const next = new Set(prev);
                if (next.has(q.id)) next.delete(q.id);
                else next.add(q.id);
                return next;
              })
            }
            className="rounded-full border border-gold/40 px-4 py-2 text-sm text-cream/80"
          >
            {flagged.has(q.id) ? "Unflag" : "Flag for review"}
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            className="ml-auto rounded-full border border-gold bg-gold px-5 py-2 text-sm font-semibold text-navy"
          >
            Submit exam
          </button>
        </div>
      </div>
      <nav aria-label="Question navigator" className="rounded-brand border border-gold/15 bg-navy-deep/60 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold/80">Navigator</p>
        <ol className="grid grid-cols-5 gap-1 text-xs">
          {questions.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className={`h-8 w-full rounded ${
                  i === index
                    ? "bg-gold text-navy font-bold"
                    : answers[item.id]
                      ? "bg-emerald-900/50 text-cream"
                      : flagged.has(item.id)
                        ? "bg-orange-900/40 text-cream"
                        : "bg-navy text-cream/70"
                }`}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
