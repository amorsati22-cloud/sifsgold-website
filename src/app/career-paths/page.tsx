import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CAREER_PATH_STUBS } from "@/data/career-paths";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Career Paths",
  description:
    "From student to working pro to leader — salary bands, certifications, and milestones across beauty, grooming, fitness, and fashion.",
  alternates: { canonical: `${BRAND.url}/career-paths` },
};

export default function CareerPathsHubPage() {
  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Career paths", href: "/career-paths" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Career paths</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream/88">
            From student to working pro to leader — explore how roles evolve inside The Gold Collective. Numbers are
            directional stubs until our research backlog lands; always verify with local markets and unions.
          </p>
        </div>
      </header>

      <section className="bg-navy-light/20 py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <ul className="grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {CAREER_PATH_STUBS.map((c) => {
              const Icon = c.Icon;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/career-paths/${c.slug}`}
                    className="flex h-full flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 transition hover:border-gold/45 hover:bg-navy-deep/90"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="mt-4 font-heading text-xl text-gold">{c.title}</span>
                    <span className="mt-2 text-sm text-cream/80">{c.shortBlurb}</span>
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold">Open path →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </article>
  );
}
