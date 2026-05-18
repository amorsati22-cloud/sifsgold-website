"use client";

import { useTransition } from "react";
import { toggleMilestoneProgress } from "@/lib/career-paths/actions";
import type { CareerMilestone } from "@/types/career-paths";

type Props = {
  milestones: CareerMilestone[];
  progress: Record<string, boolean>;
};

export function CareerPlanChecklist({ milestones, progress }: Props) {
  const [pending, startTransition] = useTransition();

  function onToggle(milestoneId: string, checked: boolean) {
    startTransition(() => {
      void toggleMilestoneProgress(milestoneId, checked);
    });
  }

  const sorted = [...milestones].sort((a, b) => a.milestone_order - b.milestone_order);
  const completed = sorted.filter((m) => progress[m.id]).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-cream/70">
        {completed} of {sorted.length} milestones marked complete (self-reported — auto-tracking
        coming later).
      </p>
      <ul className="space-y-3">
        {sorted.map((m) => {
          const done = Boolean(progress[m.id]);
          return (
            <li
              key={m.id}
              className={`rounded-brand-lg border p-4 ${
                done ? "border-teal/40 bg-teal/5" : "border-gold/20 bg-navy-deep/70"
              }`}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-gold"
                  checked={done}
                  disabled={pending}
                  onChange={(e) => onToggle(m.id, e.target.checked)}
                />
                <span>
                  <span className="font-medium text-cream">{m.name}</span>
                  <span className="mt-1 block text-xs text-cream/65">{m.description}</span>
                  {m.estimated_duration_months > 0 ? (
                    <span className="mt-1 block text-xs text-goldBody">
                      ~{m.estimated_duration_months} mo
                      {m.estimated_cost > 0
                        ? ` · est. $${m.estimated_cost.toLocaleString()}`
                        : null}
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
