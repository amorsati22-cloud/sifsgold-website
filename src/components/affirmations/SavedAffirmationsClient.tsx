"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { AffirmationShareCard } from "@/components/affirmations/AffirmationShareCard";
import { CATEGORY_LABELS } from "@/lib/affirmations/constants";
import type { AffirmationCategory, DailyAffirmation } from "@/types/affirmations";

export function SavedAffirmationsClient({ items }: { items: DailyAffirmation[] }) {
  const [category, setCategory] = useState<AffirmationCategory | "all">("all");
  const [shareTarget, setShareTarget] = useState<DailyAffirmation | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (category === "all" ? items : items.filter((a) => a.category === category)),
    [items, category],
  );

  async function shareItem(a: DailyAffirmation) {
    setShareTarget(a);
    await new Promise((r) => setTimeout(r, 50));
    if (!shareRef.current) return;
    const dataUrl = await toPng(shareRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "sifs-gold-affirmation.png";
    link.href = dataUrl;
    link.click();
  }

  if (items.length === 0) {
    return <p className="text-cream/75">No saved affirmations yet. Save cards from the daily feed.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="All" />
        {(Object.keys(CATEGORY_LABELS) as AffirmationCategory[]).map((c) => (
          <FilterChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={CATEGORY_LABELS[c]}
          />
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {filtered.map((a) => (
          <li key={a.id} className="rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-5">
            <p className="text-xs text-goldBody">{CATEGORY_LABELS[a.category]}</p>
            <p className="mt-2 text-cream/90">{a.text}</p>
            <button
              type="button"
              onClick={() => void shareItem(a)}
              className="mt-3 text-sm text-gold hover:underline"
            >
              Share card
            </button>
          </li>
        ))}
      </ul>

      {shareTarget ? (
        <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
          <AffirmationShareCard ref={shareRef} text={shareTarget.text} category={shareTarget.category} />
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs ${
        active ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
      }`}
    >
      {label}
    </button>
  );
}
