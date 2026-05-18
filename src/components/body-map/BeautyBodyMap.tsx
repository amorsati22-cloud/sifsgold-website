"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ZONE_PATHS } from "@/components/body-map/zone-paths";
import type { BodyZoneId } from "@/types/affirmations";

type Props = {
  serviceCounts: Record<BodyZoneId, number>;
};

export function BeautyBodyMap({ serviceCounts }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<BodyZoneId | null>(null);

  const go = useCallback(
    (zone: BodyZoneId) => {
      router.push(`/explore/body-map/${zone}`);
    },
    [router],
  );

  return (
    <div className="mx-auto max-w-md">
      <svg
        viewBox="0 0 200 420"
        className="w-full max-h-[min(70vh,520px)]"
        role="img"
        aria-label="Interactive beauty body map with eight zones"
      >
        <ellipse cx="100" cy="210" rx="72" ry="168" className="fill-navy-deep/40 stroke-gold/15" strokeWidth="1" />
        {(Object.keys(ZONE_PATHS) as BodyZoneId[]).map((zone) => {
          const { d } = ZONE_PATHS[zone];
          const isActive = active === zone;
          const count = serviceCounts[zone] ?? 0;
          return (
            <g key={zone}>
              <path
                d={d}
                className={`cursor-pointer transition-colors ${
                  isActive ? "fill-gold/35 stroke-gold" : "fill-gold/10 stroke-gold/40 hover:fill-gold/22"
                }`}
                strokeWidth={isActive ? 2 : 1}
                onMouseEnter={() => setActive(zone)}
                onFocus={() => setActive(zone)}
                onClick={() => go(zone)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    go(zone);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`${zone} zone, ${count} services`}
              />
            </g>
          );
        })}
      </svg>

      {active ? (
        <div className="mt-4 rounded-brand-lg border border-gold/30 bg-navy-deep/80 p-4 text-center">
          <p className="font-heading text-lg capitalize text-gold">{active.replace(/_/g, " ")}</p>
          <p className="text-sm text-cream/75">{serviceCounts[active] ?? 0} services</p>
          <Link
            href={`/explore/body-map/${active}`}
            className="mt-2 inline-block text-sm text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            View zone →
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-cream/60">Hover or tap a zone to explore services.</p>
      )}
    </div>
  );
}
