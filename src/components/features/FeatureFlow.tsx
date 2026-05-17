"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { FeatureFlowStep } from "@/types/feature-deep-dive";

export function FeatureFlow({
  idPrefix,
  heading,
  steps,
}: {
  idPrefix: string;
  heading: string;
  steps: FeatureFlowStep[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20" aria-labelledby={`${idPrefix}-flow-heading`}>
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 id={`${idPrefix}-flow-heading`} className="font-heading text-3xl text-gold md:text-4xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-cream/80">
          How this pillar fits into a real day inside The Gold Collective — from first tap to follow-through.
        </p>
        <ol className="mt-10 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-4">
          {steps.map((step, index) => {
            const n = index + 1;
            const isLast = index === steps.length - 1;
            const body = (
              <>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/15 font-heading text-sm font-bold text-gold"
                    aria-hidden
                  >
                    {n}
                  </span>
                </div>
                <h3 className="font-heading text-lg text-cream">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/80">{step.description}</p>
                {!isLast ? (
                  <span
                    className="mx-auto mt-4 block h-6 w-0.5 bg-gradient-to-b from-gold/70 to-teal/50 md:hidden"
                    aria-hidden
                  />
                ) : null}
              </>
            );

            const cardClass =
              "relative flex flex-1 flex-col rounded-brand-lg border border-gold/25 bg-navy-deep/60 p-5 md:min-h-[148px]";

            if (reduceMotion) {
              return (
                <li key={step.title} className={cardClass}>
                  {body}
                </li>
              );
            }

            return (
              <motion.li
                key={step.title}
                className={cardClass}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.28, delay: index * 0.06 }}
              >
                {body}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
