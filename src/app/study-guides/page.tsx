import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StateHoneycombMap } from "@/components/study-guides/StateHoneycombMap";
import { ALL_STATE_SLUGS, STATE_BOARD_STUBS } from "@/data/states";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Study Guides",
  description: "State board prep summaries for all 50 states plus D.C. — full prep lives in the Sif's Gold app.",
  alternates: { canonical: `${BRAND.url}/study-guides` },
};

export default function StudyGuidesHubPage() {
  const ordered = [...ALL_STATE_SLUGS].sort((a, b) => a.localeCompare(b));

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Study guides", href: "/study-guides" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">State board prep across all 50 states</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream/88">
            Plus Washington, D.C. summaries for students training inside The Gold Collective. These pages orient you to hours,
            exam vendors, passing expectations, and CE — full state board content lives inside the Sif&apos;s Gold app. These
            pages summarize what&apos;s covered.
          </p>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold md:text-3xl">Pick your jurisdiction</h2>
          <p className="mt-2 max-w-3xl text-sm text-cream/75">
            Interactive schematic (static SVG). Each cell links to a jurisdiction summary.
          </p>
          <div className="mt-8 overflow-x-auto rounded-brand-lg border border-gold/20 bg-navy-deep/50 p-4 md:p-6">
            <StateHoneycombMap />
          </div>
        </div>
      </section>

      <section className="bg-navy py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold md:text-3xl">State cards</h2>
          <p className="mt-2 text-sm text-cream/70">
            Values below are placeholders until research backlog data is merged — always verify with your school and state
            board.
          </p>
          <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((slug) => {
              const s = STATE_BOARD_STUBS[slug];
              if (!s) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/study-guides/${slug}`}
                    className="block rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 transition hover:border-gold/45 hover:bg-navy-deep/90"
                  >
                    <p className="font-heading text-lg text-gold">{s.displayName}</p>
                    <dl className="mt-3 space-y-2 text-xs text-cream/80">
                      <div className="flex justify-between gap-2">
                        <dt className="text-cream/60">Cosmetology hours</dt>
                        <dd className="text-right font-medium text-cream">{s.hoursCosmetology}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-cream/60">Exam vendor</dt>
                        <dd className="text-right font-medium text-cream">{s.examVendor}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-cream/60">Passing score</dt>
                        <dd className="text-right font-medium text-cream">{s.passingScore}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-cream/60">CE</dt>
                        <dd className="text-right font-medium text-cream">{s.ceRequirements}</dd>
                      </div>
                    </dl>
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
