"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HowItWorksStep } from "@/types/audience-landing";

export type { HowItWorksStep } from "@/types/audience-landing";

export function HowItWorks({ steps }: { steps: [HowItWorksStep, HowItWorksStep, HowItWorksStep] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-gold/10 bg-navy-light/20 py-16 md:py-20" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 id="how-it-works-heading" className="font-heading text-3xl text-gold md:text-4xl">
          How it works
        </h2>
        <ol className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
          {steps.map((step, index) => {
            const n = index + 1;
            const content = (
              <>
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/15 font-heading text-lg font-bold text-gold md:mx-auto"
                  aria-hidden
                >
                  {n}
                </span>
                <div>
                  <h3 className="font-heading text-xl text-cream">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/80">{step.description}</p>
                </div>
              </>
            );

            if (reduceMotion) {
              return (
                <li key={step.title} className="flex flex-1 gap-4 md:flex-col md:items-center md:text-center">
                  {content}
                </li>
              );
            }

            return (
              <motion.li
                key={step.title}
                className="flex flex-1 gap-4 md:flex-col md:items-center md:text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.28, delay: index * 0.05 }}
              >
                {content}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
