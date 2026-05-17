"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { getFeatureLucide } from "@/components/features/feature-lucide";
import type { FeatureGridItem } from "@/types/feature-deep-dive";

function GridCell({ item }: { item: FeatureGridItem }) {
  const Icon = getFeatureLucide(item.icon) as LucideIcon;
  const reduceMotion = useReducedMotion();

  const inner = (
    <article className="flex h-full flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 shadow-sm transition-[transform,border-color,box-shadow] duration-brand-medium motion-safe:hover:-translate-y-1 motion-reduce:hover:translate-y-0 motion-safe:hover:border-gold motion-safe:hover:shadow-[inset_0_0_28px_theme(colors.teal/14%)]">
      <div className="mb-3 inline-flex rounded-full border border-gold/40 bg-gold/10 p-2 text-gold">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-heading text-lg text-gold md:text-xl">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cream/85">{item.description}</p>
    </article>
  );

  if (reduceMotion) {
    return inner;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.28 }}
    >
      {inner}
    </motion.div>
  );
}

export function FeatureGrid({
  idPrefix,
  heading,
  intro,
  items,
}: {
  idPrefix: string;
  heading: string;
  intro?: string;
  items: FeatureGridItem[];
}) {
  return (
    <section className="border-b border-gold/10 bg-navy py-16 md:py-20" aria-labelledby={`${idPrefix}-grid-heading`}>
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 id={`${idPrefix}-grid-heading`} className="font-heading text-3xl text-gold md:text-4xl">
            {heading}
          </h2>
          {intro ? <p className="mt-3 max-w-3xl text-sm text-cream/80 md:text-base">{intro}</p> : null}
          <ul className="mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.title}>
                <GridCell item={item} />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
