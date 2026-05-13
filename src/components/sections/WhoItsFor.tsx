"use client";

import {
  BriefcaseBusiness,
  GraduationCap,
  Palette,
  Scissors,
  School,
  Store,
} from "lucide-react";
import { SectionReveal } from "@/components/sections/SectionReveal";

const AUDIENCES = [
  {
    title: "Licensed Pros",
    description:
      "Stylists, barbers, estheticians, tattoo artists, nail techs, lash artists, brow artists, massage therapists, makeup artists, med spa providers, and personal trainers. Build your business and visibility without juggling disconnected software.",
    icon: Scissors,
  },
  {
    title: "Students",
    description:
      "Cosmetology, barbering, esthetics, nail tech, massage, fitness cert, and fashion school students preparing for boards and careers. Learn, practice, and launch from one profile that grows with you.",
    icon: GraduationCap,
  },
  {
    title: "Salons & Studios",
    description:
      "Salons, barbershops, med spas, tattoo shops, piercing studios, and fitness studios managing teams and clients. Keep schedules, services, and operations aligned across your entire floor.",
    icon: Store,
  },
  {
    title: "Schools",
    description:
      "Beauty and fitness schools tracking cohorts, hours, externships, and boards-passing rates. Give staff and students a shared system that reflects real-world outcomes.",
    icon: School,
  },
  {
    title: "Fashion Industry",
    description:
      "Designers, modeling agencies, models, casting directors, stylist assistants, showrooms, and fashion event producers. Keep portfolios, bookings, and production details in one workflow.",
    icon: Palette,
  },
  {
    title: "Clients & Brands",
    description:
      "Clients booking services and brands building partnerships with the people who serve them. Discover trusted professionals and create meaningful long-term relationships.",
    icon: BriefcaseBusiness,
  },
] as const;

export function WhoItsFor() {
  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-gold/10 bg-navy-light/30 py-16 md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <SectionReveal>
          <h2 className="text-center font-heading text-3xl text-cream md:text-4xl">Who It&apos;s For</h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-cream/80">
            Sif&apos;s Gold is built around the real people who power beauty, grooming, fitness,
            and fashion every day.
          </p>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((item, index) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.title} delay={index * 0.03}>
                <article
                  aria-label={item.title}
                  className="group h-full rounded-brand-lg border border-cream/20 bg-navy-deep/70 p-6 transition-all duration-brand-medium hover:-translate-y-1 hover:border-gold/70 hover:ring-1 hover:ring-teal/60"
                >
                  <div className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 p-2 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-xl text-cream">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/80">{item.description}</p>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
