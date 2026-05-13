"use client";

import { motion, useReducedMotion } from "framer-motion";
import { STARFIELD_PARTICLES } from "@/lib/starfield-seed";

/**
 * Deep-navy backdrop: static SVG star veil at 8% opacity plus slow-drifting particles at 4%.
 * Respects prefers-reduced-motion.
 */
export function StarfieldBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-navy"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full text-cream opacity-[0.08]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="sifs-star-veil" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="20" r="0.8" fill="currentColor" />
            <circle cx="55" cy="8" r="0.5" fill="currentColor" />
            <circle cx="90" cy="40" r="0.6" fill="currentColor" />
            <circle cx="30" cy="70" r="0.4" fill="currentColor" />
            <circle cx="100" cy="95" r="0.7" fill="currentColor" />
            <circle cx="70" cy="110" r="0.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sifs-star-veil)" />
      </svg>

      <div className="absolute inset-0 text-cream opacity-[0.04]">
        {STARFIELD_PARTICLES.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-current"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.r,
              height: s.r,
            }}
            animate={
              reduceMotion
                ? {}
                : {
                    x: [0, 6, -4, 0],
                    y: [0, -5, 4, 0],
                    opacity: [0.35, 0.9, 0.5, 0.35],
                  }
            }
            transition={{
              duration: 28 + s.d * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.d,
            }}
          />
        ))}
      </div>
    </div>
  );
}
