"use client";

import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/state-board/constants";
import type { QuestionCategory } from "@/types/state-board";

const CATEGORIES: QuestionCategory[] = [
  "sanitation",
  "anatomy",
  "chemistry",
  "practical",
  "state_law",
];

export function CategoryQuizPicker({
  stateSlug,
  program,
}: {
  stateSlug: string;
  program: string;
}) {
  return (
    <ul className="mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
      {CATEGORIES.map((cat) => (
        <li key={cat}>
          <Link
            href={`/state-board-prep/${stateSlug}/${program}/quiz?mode=category&category=${cat}`}
            className="block rounded-brand-lg border border-gold/25 bg-navy-deep/70 px-4 py-3 text-gold hover:border-gold/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
