"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function FeatureCard({
  icon: Icon,
  headline,
  description,
}: {
  icon: LucideIcon;
  headline: string;
  description: string;
}) {
  const reduceMotion = useReducedMotion();

  const card = (
    <article className="group flex h-full flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-brand-medium motion-safe:hover:-translate-y-1 motion-reduce:hover:translate-y-0 motion-safe:hover:border-gold motion-safe:hover:shadow-[inset_0_0_28px_theme(colors.teal/14%)]">
      <div className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 p-2 text-gold">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-heading text-xl text-gold md:text-2xl">{headline}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/85">{description}</p>
    </article>
  );

  if (reduceMotion) {
    return card;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {card}
    </motion.div>
  );
}
