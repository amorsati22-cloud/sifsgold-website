"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  logHydration,
  startRitualSession,
  updateRitualSession,
} from "@/lib/health-hub/actions";
import { RITUAL_DISCLAIMER, RITUAL_STEPS } from "@/lib/health-hub/constants";
import { LevelSlider } from "@/components/health-hub/LevelSlider";
import { GlassInput } from "@/components/ui/GlassInput";
import { GoldButton } from "@/components/ui/GoldButton";
import type { RitualStep } from "@/types/health-hub";

export function PreShiftRitual({ sessionNumber }: { sessionNumber: number }) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<RitualStep[]>([]);
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [intention, setIntention] = useState("");
  const [affirmation, setAffirmation] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RITUAL_STEPS[0].durationSec);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = RITUAL_STEPS[stepIndex];

  const tick = useCallback(() => {
    setSecondsLeft((s) => {
      if (s <= 1) return 0;
      return s - 1;
    });
  }, []);

  useEffect(() => {
    if (!started || secondsLeft <= 0) return;
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [started, secondsLeft, tick]);

  async function beginRitual() {
    setError(null);
    const result = await startRitualSession(moodBefore);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSessionId(result.sessionId);
    setStarted(true);
    setSecondsLeft(step.durationSec);
  }

  async function completeStep(skip = false) {
    if (!sessionId) return;
    const stepId = step.id;
    const nextCompleted = skip ? completed : [...completed, stepId];

    if (stepId === "hydration" && !skip) {
      await logHydration(8);
    }

    if (stepId === "mindset_check" && intention.trim()) {
      await updateRitualSession(sessionId, {
        stepsCompleted: nextCompleted,
        intention: intention.trim(),
      });
    } else if (stepId === "intentions" && affirmation.trim()) {
      await updateRitualSession(sessionId, {
        stepsCompleted: nextCompleted,
        intention: affirmation.trim(),
        moodAfter,
        complete: true,
        durationSeconds: RITUAL_STEPS.reduce((a, s) => a + s.durationSec, 0),
      });
      router.refresh();
      setStepIndex(RITUAL_STEPS.length);
      return;
    } else {
      await updateRitualSession(sessionId, { stepsCompleted: nextCompleted });
    }

    setCompleted(nextCompleted);

    if (stepIndex >= RITUAL_STEPS.length - 1) {
      await updateRitualSession(sessionId, {
        stepsCompleted: nextCompleted,
        moodAfter,
        complete: true,
        durationSeconds: RITUAL_STEPS.reduce((a, s) => a + s.durationSec, 0),
      });
      router.refresh();
      setStepIndex(RITUAL_STEPS.length);
      return;
    }

    const next = stepIndex + 1;
    setStepIndex(next);
    setSecondsLeft(RITUAL_STEPS[next].durationSec);
  }

  if (stepIndex >= RITUAL_STEPS.length) {
    return (
      <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-8 text-center">
        <h2 className="font-heading text-2xl text-gold">Ritual complete</h2>
        <p className="mt-3 font-body text-cream/85">
          You showed up for yourself before your shift. Go serve your clients with intention.
        </p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="space-y-6 rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6">
        <p className="font-body text-xs text-goldBody">{RITUAL_DISCLAIMER}</p>
        <p className="font-body text-sm text-cream/80">
          Today&apos;s pre-shift ritual #{sessionNumber}
        </p>
        <LevelSlider
          id="mood-before"
          name="mood_before"
          label="Mood before"
          value={moodBefore}
          onChange={setMoodBefore}
        />
        <GoldButton label="Begin 5-minute ritual" variant="solid" onClick={beginRitual} />
        {error ? (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-6">
      <p className="font-body text-sm text-gold">
        Step {stepIndex + 1} of {RITUAL_STEPS.length}: {step.title}
      </p>
      <p className="font-body text-cream/85">{step.description}</p>

      {step.id === "breathwork" ? (
        <BreathworkAnimation reduceMotion={reduceMotion} secondsLeft={secondsLeft} theme={theme} />
      ) : null}

      {(step.id === "stretch_wrists" || step.id === "stretch_back") && !reduceMotion ? (
        <StretchAnimation stepId={step.id} color={theme.colors.gold} />
      ) : null}

      {step.id === "mindset_check" ? (
        <div>
          <label htmlFor="intention" className="mb-1 block font-body text-sm text-cream">
            How do you want to show up for your clients today? (encrypted)
          </label>
          <textarea
            id="intention"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-offwhite focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/20"
          />
        </div>
      ) : null}

      {step.id === "intentions" ? (
        <div className="space-y-4">
          <GlassInput
            value={affirmation}
            onChange={(e) => setAffirmation(e.target.value)}
            placeholder="One-line affirmation"
            aria-label="Final intention"
          />
          <LevelSlider
            id="mood-after"
            name="mood_after"
            label="Mood after"
            value={moodAfter}
            onChange={setMoodAfter}
          />
        </div>
      ) : null}

      {!reduceMotion && step.id !== "breathwork" ? (
        <p className="font-mono text-sm text-goldBody" aria-live="polite">
          {secondsLeft}s
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <GoldButton label="Skip step" variant="ghost" onClick={() => completeStep(true)} />
        <GoldButton label="Complete step" variant="solid" onClick={() => completeStep(false)} />
      </div>
    </div>
  );
}

function BreathworkAnimation({
  reduceMotion,
  secondsLeft,
  theme,
}: {
  reduceMotion: boolean | null;
  secondsLeft: number;
  theme: ReturnType<typeof useTheme>;
}) {
  const scale = reduceMotion ? 1 : secondsLeft % 8 < 4 ? 1.15 : 0.85;

  return (
    <motion.div
      className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2"
      style={{ borderColor: theme.colors.gold }}
      animate={reduceMotion ? undefined : { scale }}
      transition={reduceMotion ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <span className="font-body text-sm text-gold">4 · 7 · 8</span>
    </motion.div>
  );
}

function StretchAnimation({ stepId, color }: { stepId: string; color: string }) {
  return (
    <motion.div
      className="mx-auto h-24 w-24 rounded-brand-lg border-2"
      style={{ borderColor: color }}
      animate={{ rotate: stepId === "stretch_wrists" ? [0, 15, -15, 0] : [0, 4, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}
