"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  END_ROLE_LABELS,
  STARTING_POINT_LABELS,
} from "@/lib/career-paths/constants";
import type { CareerPath, EndRole, StartingPoint } from "@/types/career-paths";

const STARTING_POINTS: StartingPoint[] = [
  "high_school",
  "career_change",
  "currently_licensed",
  "experienced_pro",
];

const END_ROLES: EndRole[] = [
  "salon_owner",
  "platform_artist",
  "educator",
  "celebrity_stylist",
];

export function CareerPathExplorer({ paths }: { paths: CareerPath[] }) {
  const router = useRouter();
  const [starting, setStarting] = useState<StartingPoint>("high_school");
  const [end, setEnd] = useState<EndRole | "">("");

  const matches = paths.filter(
    (p) => p.starting_point === starting && (!end || p.end_role === end),
  );

  function showPaths() {
    if (matches.length === 1) {
      router.push(`/career-paths/${matches[0].id}`);
      return;
    }
    if (matches.length > 1) {
      router.push(
        `/career-paths?starting=${starting}${end ? `&end=${end}` : ""}#matches`,
      );
      return;
    }
    router.push(`/career-paths?starting=${starting}#matches`);
  }

  return (
    <section className="rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-6 md:p-8">
      <h2 className="font-heading text-2xl text-gold">Where are you starting from?</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {STARTING_POINTS.map((sp) => (
          <button
            key={sp}
            type="button"
            onClick={() => setStarting(sp)}
            className={`rounded-brand border px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              starting === sp
                ? "border-gold bg-gold/10 text-gold"
                : "border-gold/20 text-cream/85 hover:border-gold/40"
            }`}
          >
            {STARTING_POINT_LABELS[sp]}
          </button>
        ))}
      </div>

      <h3 className="mt-8 font-heading text-lg text-gold">Where do you want to go? (optional)</h3>
      <p className="mt-1 text-xs text-cream/60">
        Multiple paths exist for each starting point — this narrows suggestions, not a single
        &quot;right&quot; route.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEnd("")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold ${
            end === "" ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
          }`}
        >
          Show all paths
        </button>
        {END_ROLES.map((er) => (
          <button
            key={er}
            type="button"
            onClick={() => setEnd(er)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold ${
              end === er ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-cream/70"
            }`}
          >
            {END_ROLE_LABELS[er]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-goldBody">
        {matches.length} path{matches.length === 1 ? "" : "s"} match your filters.
      </p>

      <button
        type="button"
        onClick={showPaths}
        className="mt-6 rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Show me my paths
      </button>
    </section>
  );
}
