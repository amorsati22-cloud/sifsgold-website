"use client";

import { useState } from "react";
import Link from "next/link";
import { saveQuizResults } from "@/lib/career-paths/actions";
import { CAREER_QUIZ, scoreQuiz } from "@/lib/career-paths/quiz";
import type { CareerRole } from "@/types/career-paths";

export function CareerQuiz({ roles }: { roles: CareerRole[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);

  const q = CAREER_QUIZ[index];
  const done = index >= CAREER_QUIZ.length;

  async function finish(finalAnswers: Record<string, string>) {
    const top = scoreQuiz(finalAnswers);
    setResults(top);
    await saveQuizResults(top);
  }

  function next() {
    if (!q) return;
    if (index + 1 >= CAREER_QUIZ.length) {
      void finish(answers);
      setIndex(CAREER_QUIZ.length);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (done && results) {
    const matched = results
      .map((id) => roles.find((r) => r.id === id))
      .filter(Boolean) as CareerRole[];
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-2xl text-gold">Your top matches</h2>
        <p className="text-sm text-cream/75">
          Based on your answers — explore multiple paths; none is the only valid route.
        </p>
        <ol className="list-decimal space-y-3 pl-5">
          {matched.map((r) => (
            <li key={r.id} className="text-cream/90">
              <Link href={`/career-paths/roles/${r.id}`} className="font-medium text-gold hover:underline">
                {r.name}
              </Link>
              <span className="text-goldBody"> — median ${r.median_annual_salary.toLocaleString()}/yr (BLS estimate)</span>
            </li>
          ))}
        </ol>
        <Link
          href="/career-paths"
          className="inline-flex rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy"
        >
          Explore matched paths
        </Link>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="space-y-6">
      <p className="text-xs text-goldBody">
        Question {index + 1} of {CAREER_QUIZ.length}
      </p>
      <p className="text-lg text-cream">{q.prompt}</p>
      <fieldset className="space-y-2">
        {q.options.map((opt) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer rounded-brand border px-4 py-3 text-sm ${
              answers[q.id] === opt.id ? "border-gold bg-gold/10" : "border-gold/20"
            }`}
          >
            <input
              type="radio"
              name={q.id}
              className="mr-3 accent-gold"
              checked={answers[q.id] === opt.id}
              onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
            />
            {opt.label}
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        disabled={!answers[q.id]}
        onClick={next}
        className="rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy disabled:opacity-50"
      >
        {index + 1 >= CAREER_QUIZ.length ? "See results" : "Next"}
      </button>
    </div>
  );
}
