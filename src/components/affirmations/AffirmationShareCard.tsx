"use client";

import { forwardRef } from "react";
import { CATEGORY_LABELS } from "@/lib/affirmations/constants";
import type { AffirmationCategory } from "@/types/affirmations";

type Props = {
  text: string;
  category: AffirmationCategory;
};

export const AffirmationShareCard = forwardRef<HTMLDivElement, Props>(function AffirmationShareCard(
  { text, category },
  ref,
) {
  return (
    <div
      ref={ref}
      className="aspect-[4/5] w-full max-w-sm rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-navy-deep via-navy to-navy-light p-8 text-center shadow-2xl"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Sif&apos;s Gold · Daily</p>
      <p className="mt-8 font-heading text-2xl leading-relaxed text-cream">{text}</p>
      <p className="mt-8 text-xs text-goldBody">{CATEGORY_LABELS[category]}</p>
      <p className="mt-2 text-[10px] text-cream/50">sifsgold.com/daily</p>
    </div>
  );
});
