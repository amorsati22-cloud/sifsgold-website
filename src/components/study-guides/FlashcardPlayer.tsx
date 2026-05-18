"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { endStudySession, gradeCard } from "@/lib/study-guides/actions";
import { STUDY_GRADE_LABELS } from "@/lib/study-guides/constants";
import type { Flashcard, StudyGrade } from "@/types/study-guides";

type Props = {
  cards: Flashcard[];
  deckId: string;
  sessionId: string;
  startedAt: string;
  guideId: string;
};

export function FlashcardPlayer({ cards, deckId, sessionId, startedAt, guideId }: Props) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);

  const card = cards[index];
  const total = cards.length;
  const done = index >= total;

  const handleGrade = useCallback(
    async (grade: StudyGrade) => {
      if (!card || busy) return;
      setBusy(true);
      const result = await gradeCard({
        cardId: card.id,
        deckId,
        sessionId,
        grade,
      });
      setBusy(false);
      if (!result.ok) return;
      setFlipped(false);
      setIndex((i) => i + 1);
    },
    [card, busy, deckId, sessionId],
  );

  async function handleEnd() {
    setBusy(true);
    await endStudySession({ sessionId, deckId, startedAt });
    setBusy(false);
    router.push(`/study-guides/${guideId}/${deckId}`);
    router.refresh();
  }

  if (total === 0) {
    return (
      <p className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 text-sm text-cream/80">
        No cards in this deck yet.
      </p>
    );
  }

  if (done) {
    return (
      <motion.div
        className="rounded-brand-lg border border-gold/25 bg-navy-deep/80 p-8 text-center"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="font-heading text-xl text-gold">Session complete</p>
        <p className="mt-2 text-sm text-cream/80">You reviewed {total} cards. Come back when more are due.</p>
        <button
          type="button"
          onClick={handleEnd}
          disabled={busy}
          className="mt-6 rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-60"
        >
          End session
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="h-2 overflow-hidden rounded-full bg-navy-deep"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Card ${index + 1} of ${total}`}
      >
        <motion.div
          className="h-full bg-gold"
          initial={false}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
        />
      </motion.div>
      <p className="text-center text-xs text-goldBody">
        {index + 1} / {total}
      </p>

      <div className="perspective-[1200px] mx-auto max-w-xl">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="relative h-64 w-full cursor-pointer rounded-brand-lg border border-gold/30 bg-navy-deep/90 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy md:h-72"
          aria-pressed={flipped}
          aria-label={flipped ? "Show question" : "Show answer"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={flipped ? "back" : "front"}
              initial={
                reduceMotion
                  ? false
                  : { rotateY: flipped ? -90 : 90, opacity: 0 }
              }
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { rotateY: flipped ? 90 : -90, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
              className="flex h-full flex-col justify-center"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gold/80">
                {flipped ? "Answer" : "Question"}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-cream">
                {flipped ? card.back_text : card.front_text}
              </p>
              {flipped && card.mnemonics ? (
                <p className="mt-4 text-sm text-goldBody">Mnemonic: {card.mnemonics}</p>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </button>
        <p className="mt-2 text-center text-xs text-cream/60">Tap card to flip</p>
      </div>

      {flipped ? (
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          role="group"
          aria-label="Rate your recall"
        >
          {(Object.keys(STUDY_GRADE_LABELS) as StudyGrade[]).map((grade) => {
            const { label, color } = STUDY_GRADE_LABELS[grade];
            return (
              <button
                key={grade}
                type="button"
                disabled={busy}
                onClick={() => handleGrade(grade)}
                className={`rounded-brand-lg px-3 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-60 ${color}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-sm text-cream/70">Flip the card, then rate how well you knew it.</p>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleEnd}
          disabled={busy}
          className="text-sm text-cream/70 underline-offset-2 hover:text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          End session
        </button>
      </div>
    </div>
  );
}
