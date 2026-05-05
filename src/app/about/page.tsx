import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Sif's Gold",
  description:
    "Built from inside the industry — a beauty and fashion platform from Minneapolis for every role in the field.",
};

const VALUES = [
  {
    title: "Built for Everyone",
    body: "Gender balance, all disciplines, and all career stages — designed so the whole industry can show up as they are.",
  },
  {
    title: "Data Owned By You",
    body: "Your client records, your formulas, and your business data belong to you — not locked behind someone else’s dashboard.",
  },
  {
    title: "Community First",
    body: "Not an algorithm-driven feed — a genuine professional community built around real relationships and craft.",
  },
  {
    title: "Honest Revenue",
    body: "The platform helps you earn more, not less — with transparent economics that respect how you actually work.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Built from inside the industry.
          </h1>
        </div>
      </header>

      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Our story</h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-white/70">
            The platform was built because beauty professionals, students, and fashion talent
            deserved a platform built specifically for their world — not adapted from generic
            booking software. Sif&apos;s Gold is named for Sif, the Norse goddess associated with
            gold, harvest, and abundance. The platform is built from Minneapolis, Minnesota.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-navy-light/15 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Mission</h2>
          <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-offwhite sm:text-2xl">
            A platform where every role in beauty and fashion has a home. Where a cosmetology
            student and a runway producer can both find exactly what they need, in one place.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Values
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {VALUES.map((v) => (
              <li
                key={v.title}
                className="rounded-2xl border border-white/10 bg-navy-light/30 p-8 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-offwhite">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 bg-navy-dark/40 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Team</h2>
          <p className="mt-6 text-lg text-white/80">
            Sif&apos;s Gold is a founder-led company.
          </p>
        </div>
      </section>
    </div>
  );
}
