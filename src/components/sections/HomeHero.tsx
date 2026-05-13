"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { WheatBranch } from "@/components/decorative/WheatBranch";

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative left-1/2 flex min-h-[100dvh] w-screen max-w-[100vw] -translate-x-1/2 items-center overflow-hidden border-b border-gold/15 bg-navy px-6 py-16 md:min-h-screen md:px-10 md:py-20">
      <div className="relative z-10 mx-auto grid w-full max-w-content items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <h1 className="bg-gradient-to-r from-cream via-gold to-teal bg-clip-text font-heading text-4xl font-black leading-tight text-transparent md:text-6xl">
            Beauty. Grooming. Fitness. Fashion. One platform.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base text-cream/90 md:text-lg lg:mx-0">
            For the pros, students, salons, brands, and clients who built the industry.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a
              href="#waitlist"
              className="group inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-3 font-body text-sm font-semibold text-navy transition-all duration-brand-fast hover:shadow-lg hover:shadow-gold/20 sm:w-auto"
            >
              <span className="group-hover:animate-gold-shimmer">Join Sif&apos;s Circle</span>
            </a>
            <a
              href="#features"
              className="group inline-flex w-full items-center justify-center rounded-full border border-gold/60 px-6 py-3 font-body text-sm font-semibold text-gold transition-all duration-brand-fast hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/20 sm:w-auto"
            >
              See what&apos;s coming
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
          className="mx-auto w-full max-w-sm"
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[2rem] border border-gold/50 bg-gradient-to-b from-navy-light to-navy-deep p-3 shadow-nav"
            aria-label="Sif's Gold app preview placeholder"
            role="img"
          >
            <div className="rounded-[1.6rem] border border-gold/20 bg-navy p-5">
              <div className="mb-4 flex items-center gap-2 text-gold">
                <Smartphone className="h-4 w-4" aria-hidden />
                <p className="font-body text-xs uppercase tracking-wide text-gold/90">
                  App Preview
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-14 rounded-brand-md border border-gold/20 bg-navy-light/60" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-brand-md border border-teal/25 bg-navy-light/50" />
                  <div className="h-16 rounded-brand-md border border-gold/25 bg-navy-light/50" />
                </div>
                <div className="h-20 rounded-brand-md border border-cream/20 bg-navy-light/60" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <WheatBranch className="pointer-events-none absolute bottom-4 right-4 h-12 w-28 text-gold/50 md:bottom-8 md:right-10 md:h-16 md:w-40" />
    </section>
  );
}
