"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarClock,
  CreditCard,
  GraduationCap,
  Image,
  Music2,
  NotebookTabs,
  Sparkles,
} from "lucide-react";
import { GoddessProfile } from "@/components/decorative/GoddessProfile";
import { SectionReveal } from "@/components/sections/SectionReveal";

const PROBLEM_ICONS = [
  { Icon: CalendarClock, label: "Booking" },
  { Icon: GraduationCap, label: "Education" },
  { Icon: Music2, label: "Music" },
  { Icon: Image, label: "Photos" },
  { Icon: CreditCard, label: "Payments" },
  { Icon: NotebookTabs, label: "Calendars" },
] as const;

const CONVERGE_POSITIONS = [
  "-translate-x-32 -translate-y-20",
  "translate-y-[-7rem]",
  "translate-x-32 -translate-y-20",
  "-translate-x-28 translate-y-16",
  "translate-y-24",
  "translate-x-28 translate-y-16",
] as const;

export function ProblemStatement() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-gold/10 bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 className="mx-auto max-w-4xl text-center font-heading text-3xl text-cream md:text-5xl">
            The industry has 15 apps to do what should be one.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-center text-base text-cream/80 md:text-lg">
            Beauty, fashion, and fitness professionals are forced to stitch together fragmented
            tools: booking on one app, education on another, music on a third, photos on a fourth,
            payments on a fifth, and calendars on a sixth.
          </p>
        </SectionReveal>

        <div className="relative mx-auto mt-12 flex h-72 w-full max-w-3xl items-center justify-center overflow-hidden rounded-brand-lg border border-gold/15 bg-navy-deep/60 backdrop-blur-sm">
          {PROBLEM_ICONS.map(({ Icon, label }, index) => (
            <motion.div
              key={label}
              className={`absolute flex h-14 w-14 items-center justify-center rounded-full border border-cream/25 bg-navy-light/70 text-cream ${CONVERGE_POSITIONS[index]}`}
              initial={reduceMotion ? undefined : { opacity: 0.85, scale: 1 }}
              whileInView={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.75, 0.25, 0],
                      x: [0, 0, 0],
                      y: [0, 0, 0],
                      scale: [1, 0.9, 0.3],
                    }
              }
              viewport={{ once: false, amount: 0.5 }}
              transition={{
                duration: 2.2,
                delay: index * 0.1,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeInOut",
              }}
              aria-label={`${label} app icon`}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </motion.div>
          ))}

          <motion.div
            initial={reduceMotion ? undefined : { scale: 0.95, opacity: 0.8 }}
            whileInView={reduceMotion ? undefined : { scale: [0.95, 1, 0.95], opacity: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-gold/45 bg-navy text-gold ring-2 ring-teal/40"
            aria-label="Sif's Gold app icon"
            role="img"
          >
            <GoddessProfile className="h-14 w-14" aria-hidden />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-teal" aria-hidden />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
