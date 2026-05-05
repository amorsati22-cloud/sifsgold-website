import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Sif's Gold",
  description:
    "Industry insights, platform updates, and education for beauty and fashion professionals.",
};

const POSTS = [
  {
    category: "Student",
    title: "The Complete Guide to Cosmetology State Board Exam Prep in 2026",
    excerpt:
      "Everything you need to know about preparing for your state's cosmetology written exam — from question types to study strategies that actually work.",
  },
  {
    category: "Professional",
    title: "How Independent Hair Stylists Can Build a Fully Booked Calendar Without Paying Commission",
    excerpt:
      "A breakdown of why routing client bookings through your own channels is the single most impactful revenue decision you can make.",
  },
  {
    category: "Barbershop",
    title: "The Best Barbershop Management Software in 2026",
    excerpt:
      "What barbershop owners actually need from a platform — and how Sif's Gold compares to the alternatives built for salons first.",
  },
  {
    category: "School",
    title: "How Beauty Schools Can Improve Board Pass Rates with Technology",
    excerpt:
      "Data-driven approaches to board exam preparation that school administrators can implement immediately.",
  },
  {
    category: "Fashion",
    title: "What Is a Comp Card? A Complete Guide for Aspiring Models",
    excerpt:
      "Comp cards, measurements, market formats, and everything a new model needs to know before their first go-see.",
  },
] as const;

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-navy font-body text-offwhite">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/40 to-navy">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            The Sif&apos;s Gold Blog
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
            Industry insights, platform updates, and education for beauty and fashion professionals.
          </p>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post) => (
              <li
                key={post.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-navy-light/30 p-6 shadow-sm transition hover:border-gold/30"
              >
                <span className="inline-flex w-fit items-center rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
                  {post.category}
                </span>
                <h2 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-offwhite">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{post.excerpt}</p>
                <Link
                  href="#"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
                >
                  Read More →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
