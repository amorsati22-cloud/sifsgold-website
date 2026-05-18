import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StartStudyButton } from "@/components/study-guides/StartStudyButton";
import { PROGRAM_TYPE_LABELS } from "@/lib/study-guides/constants";
import {
  getGuideDecksWithProgress,
  getStudyGuide,
  getStudyUser,
} from "@/lib/study-guides/data";
import { BRAND } from "@/lib/constants";

type Props = { params: { guide_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await getStudyGuide(params.guide_id);
  if (!guide) return { title: "Study guide" };
  return {
    title: guide.name,
    description: guide.description ?? undefined,
    alternates: { canonical: `${BRAND.url}/study-guides/${guide.id}` },
  };
}

export default async function StudyGuideDetailPage({ params }: Props) {
  const guide = await getStudyGuide(params.guide_id);
  if (!guide) notFound();

  const { user } = await getStudyUser();
  const decks = await getGuideDecksWithProgress(guide.id, user?.id ?? null);
  const firstUnlocked = decks.find((d) => !d.locked);

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Study guides", href: "/study-guides" },
          { name: guide.name, href: `/study-guides/${guide.id}` },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold/90">
            {guide.state ? `${guide.state} · ` : ""}
            {guide.program_type ? PROGRAM_TYPE_LABELS[guide.program_type] : "Study guide"}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-black text-gold md:text-5xl">{guide.name}</h1>
          {guide.description ? (
            <p className="mt-4 max-w-3xl text-cream/85">{guide.description}</p>
          ) : null}
          <dl className="mt-6 flex flex-wrap gap-6 text-sm">
            <div>
              <dt className="text-cream/60">Cards</dt>
              <dd className="font-medium text-gold">{guide.total_cards}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Estimated time</dt>
              <dd className="font-medium text-cream">{guide.estimated_hours} hours</dd>
            </div>
            <div>
              <dt className="text-cream/60">Level</dt>
              <dd className="font-medium capitalize text-cream">{guide.level ?? "All levels"}</dd>
            </div>
          </dl>
          {firstUnlocked ? (
            <div className="mt-8">
              <StartStudyButton
                deckId={firstUnlocked.id}
                label="Start studying"
              />
            </div>
          ) : null}
        </div>
      </header>

      <section className="bg-navy py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">Decks — recommended order</h2>
          <p className="mt-2 text-sm text-cream/75">
            Complete each deck to roughly 80% mastery to unlock the next. Due cards surface first in study
            sessions.
          </p>
          <ol className="mt-8 list-none space-y-4 p-0">
            {decks.map((deck) => (
              <li
                key={deck.id}
                className={`rounded-brand-lg border p-5 ${
                  deck.locked
                    ? "border-cream/15 bg-navy-deep/40 opacity-80"
                    : "border-gold/25 bg-navy-deep/70"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-heading text-lg text-gold">
                      {deck.order_index}. {deck.name}
                      {deck.locked ? (
                        <span className="ml-2 text-xs font-normal text-cream/50">(locked)</span>
                      ) : null}
                    </p>
                    {deck.description ? (
                      <p className="mt-1 text-sm text-cream/75">{deck.description}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-cream/60">
                      {deck.card_count} cards · {deck.dueCount} due now
                    </p>
                  </div>
                  {!deck.locked ? (
                    <Link
                      href={`/study-guides/${guide.id}/${deck.id}`}
                      className="shrink-0 rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      Open deck
                    </Link>
                  ) : null}
                </div>
                <motion.div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-navy"
                  role="progressbar"
                  aria-valuenow={deck.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${deck.name} progress`}
                >
                  <div
                    className="h-full bg-gold transition-[width]"
                    style={{ width: `${deck.progressPercent}%` }}
                  />
                </motion.div>
                <p className="mt-1 text-xs text-goldBody">{deck.progressPercent}% mastered</p>
              </li>
            ))}
          </ol>
        </motion.div>
      </section>
    </article>
  );
}
