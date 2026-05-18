import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CareerPathExplorer } from "@/components/career-paths/CareerPathExplorer";
import { listPaths } from "@/lib/career-paths/data";
import { BRAND } from "@/lib/constants";
import type { EndRole, StartingPoint } from "@/types/career-paths";

export const metadata: Metadata = {
  title: "Career Paths",
  description:
    "Interactive career maps from student to licensed pro to specialty and ownership — BLS median wages, state-accurate training, multiple valid routes.",
  alternates: { canonical: `${BRAND.url}/career-paths` },
};

type Props = { searchParams: { starting?: string; end?: string } };

export default async function CareerPathsPage({ searchParams }: Props) {
  const allPaths = await listPaths();
  const starting = searchParams.starting as StartingPoint | undefined;
  const end = searchParams.end as EndRole | undefined;
  const filtered =
    starting || end
      ? await listPaths(starting, end)
      : allPaths;

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
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">
            Career path explorer
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream/88">
            From &quot;I&apos;m interested in beauty&quot; through school, licensure, specialty, and
            advancement — with median salary data from the U.S. Bureau of Labor Statistics. Every
            starting point has multiple valid paths, not one prescribed ladder.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/career-paths/roles" className="text-gold hover:underline">
              Browse all roles
            </Link>
            <span className="text-cream/40">·</span>
            <Link href="/career-paths/quiz" className="text-gold hover:underline">
              Career match quiz
            </Link>
          </div>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <CareerPathExplorer paths={allPaths} />
        </div>
      </section>

      {filtered.length > 0 && (starting || end) ? (
        <section id="matches" className="border-t border-gold/10 bg-navy-light/20 py-12">
          <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
            <h2 className="font-heading text-2xl text-gold">Matching paths</h2>
            <ul className="mt-6 space-y-4">
              {filtered.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/career-paths/${p.id}`}
                    className="block rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-5 hover:border-gold/45"
                  >
                    <p className="font-heading text-lg text-gold">{p.name}</p>
                    <p className="mt-1 text-sm text-cream/80">{p.description}</p>
                    <p className="mt-2 text-xs text-goldBody">
                      ~{p.estimated_total_years} years · est. $
                      {p.estimated_total_investment.toLocaleString()} investment
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
