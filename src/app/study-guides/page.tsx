import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StateHoneycombMap } from "@/components/study-guides/StateHoneycombMap";
import { StudyGuideFilters } from "@/components/study-guides/StudyGuideFilters";
import { PROGRAM_TYPE_LABELS } from "@/lib/study-guides/constants";
import { listStudyGuidesWithProgress, getStudyUser } from "@/lib/study-guides/data";
import { BRAND } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Study Guides",
  description:
    "Interactive flashcards with spaced repetition for state board theory — sanitation, color, anatomy, and more.",
  alternates: { canonical: `${BRAND.url}/study-guides` },
};

type Props = { searchParams: { program?: string; state?: string } };

export default async function StudyGuidesHubPage({ searchParams }: Props) {
  const { user } = await getStudyUser();
  const guides = isSupabaseConfigured()
    ? await listStudyGuidesWithProgress(user?.id ?? null, {
        program: searchParams.program ?? null,
        state: searchParams.state ?? null,
      })
    : [];

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
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">
            Interactive state board study guides
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream/88">
            Flashcards with spaced repetition, progress tracking, and performance analytics — the same study
            system as the Sif&apos;s Gold app. Filter by program and state, then drill decks until you master
            each topic.
          </p>
          {!isSupabaseConfigured() ? (
            <p className="mt-4 text-sm text-goldBody">
              Connect Supabase to load live guides. Seed content ships in{" "}
              <code className="text-cream/90">schema-study-guides.sql</code>.
            </p>
          ) : null}
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-10 md:py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <Suspense fallback={<p className="text-sm text-cream/70">Loading filters…</p>}>
            <StudyGuideFilters />
          </Suspense>
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold md:text-3xl">Study guides</h2>
          {guides.length === 0 ? (
            <p className="mt-4 text-sm text-cream/75">
              No guides match your filters yet. Run the study guides schema migration to load Texas, California,
              and Florida cosmetology decks.
            </p>
          ) : (
            <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <li key={guide.id}>
                  <Link
                    href={`/study-guides/${guide.id}`}
                    className="flex h-full flex-col rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 transition hover:border-gold/45 hover:bg-navy-deep/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    <p className="font-heading text-lg text-gold">{guide.name}</p>
                    <p className="mt-2 text-xs text-cream/70">
                      {guide.state ? `${guide.state} · ` : ""}
                      {guide.program_type
                        ? PROGRAM_TYPE_LABELS[guide.program_type]
                        : "All programs"}
                      {guide.level ? ` · ${guide.level}` : ""}
                    </p>
                    {guide.description ? (
                      <p className="mt-3 flex-1 text-sm text-cream/80 line-clamp-3">{guide.description}</p>
                    ) : null}
                    <dl className="mt-4 space-y-2 border-t border-gold/10 pt-4 text-xs text-cream/80">
                      <div className="flex justify-between gap-2">
                        <dt className="text-cream/60">Cards</dt>
                        <dd className="font-medium text-cream">{guide.total_cards}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-cream/60">Est. hours</dt>
                        <dd className="font-medium text-cream">{guide.estimated_hours}h</dd>
                      </div>
                      {user ? (
                        <div className="flex justify-between gap-2">
                          <dt className="text-cream/60">Your progress</dt>
                          <dd className="font-medium text-gold">{guide.progressPercent}%</dd>
                        </div>
                      ) : null}
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {user ? (
            <p className="mt-6 text-sm text-cream/70">
              <Link
                href="/dashboard/study-progress"
                className="text-gold underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                View study analytics
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-sm text-cream/70">
              <Link href="/sign-in?next=/study-guides" className="text-gold underline-offset-2 hover:underline">
                Sign in
              </Link>{" "}
              to save progress and streaks.
            </p>
          )}
        </div>
      </section>

      <section className="border-b border-gold/10 bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold md:text-3xl">Jurisdiction summaries</h2>
          <p className="mt-2 max-w-3xl text-sm text-cream/75">
            Static board facts by state — always verify hours and vendors with your school and licensing agency.
          </p>
          <div className="mt-8 overflow-x-auto rounded-brand-lg border border-gold/20 bg-navy-deep/50 p-4 md:p-6">
            <StateHoneycombMap />
          </div>
          <p className="mt-4 text-sm">
            <Link href="/study-guides/state/tx" className="text-gold hover:underline">
              Browse all state summaries →
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
