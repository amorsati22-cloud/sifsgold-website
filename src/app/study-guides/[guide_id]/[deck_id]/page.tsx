import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StartStudyButton } from "@/components/study-guides/StartStudyButton";
import {
  getDeckCards,
  getDeckWithGuide,
  getGuideDecksWithProgress,
  getRecentSessions,
  getStudyUser,
} from "@/lib/study-guides/data";
import { BRAND } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";

type Props = { params: { guide_id: string; deck_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await getDeckWithGuide(params.deck_id);
  if (!row) return { title: "Deck" };
  return {
    title: `${row.name} · ${row.study_guides.name}`,
    alternates: { canonical: `${BRAND.url}/study-guides/${params.guide_id}/${params.deck_id}` },
  };
}

function avgExamRelevance(cards: { exam_relevance: number }[]): string {
  if (cards.length === 0) return "—";
  const avg = cards.reduce((s, c) => s + c.exam_relevance, 0) / cards.length;
  if (avg >= 4.5) return "High";
  if (avg >= 3.5) return "Medium-high";
  if (avg >= 2.5) return "Medium";
  return "Foundational";
}

export default async function DeckDetailPage({ params }: Props) {
  const row = await getDeckWithGuide(params.deck_id);
  if (!row || row.study_guide_id !== params.guide_id) notFound();

  const guide = row.study_guides;
  const cards = await getDeckCards(params.deck_id);
  const { user } = await getStudyUser();
  const decks = await getGuideDecksWithProgress(params.guide_id, user?.id ?? null);
  const deckProgress = decks.find((d) => d.id === params.deck_id);
  const sessions = user ? await getRecentSessions(params.deck_id, user.id) : [];

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Study guides", href: "/study-guides" },
          { name: guide.name, href: `/study-guides/${guide.id}` },
          { name: row.name, href: `/study-guides/${guide.id}/${row.id}` },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">{row.name}</h1>
          {row.description ? <p className="mt-4 max-w-2xl text-cream/85">{row.description}</p> : null}
          <dl className="mt-6 flex flex-wrap gap-6 text-sm">
            <div>
              <dt className="text-cream/60">Cards</dt>
              <dd className="font-medium text-cream">{row.card_count}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Board relevance</dt>
              <dd className="font-medium text-cream">{avgExamRelevance(cards)}</dd>
            </div>
            {deckProgress ? (
              <div>
                <dt className="text-cream/60">Your progress</dt>
                <dd className="font-medium text-gold">{deckProgress.progressPercent}%</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-8">
            <StartStudyButton
              deckId={row.id}
              locked={deckProgress?.locked}
              label="Start session"
            />
          </div>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-xl text-gold">Recent sessions</h2>
          {sessions.length === 0 ? (
            <p className="mt-3 text-sm text-cream/70">No completed sessions yet.</p>
          ) : (
            <ul className="mt-4 list-none space-y-3 p-0">
              {sessions.map((s) => {
                const accuracy =
                  s.cards_reviewed && s.correct_count != null
                    ? Math.round((s.correct_count / s.cards_reviewed) * 100)
                    : null;
                return (
                  <li
                    key={s.id}
                    className="rounded-brand border border-gold/15 bg-navy-deep/60 px-4 py-3 text-sm"
                  >
                    <span className="text-cream/80">
                      {s.ended_at
                        ? formatDistanceToNow(new Date(s.ended_at), { addSuffix: true })
                        : "—"}
                    </span>
                    <span className="mx-2 text-cream/40">·</span>
                    <span>{s.cards_reviewed ?? 0} cards</span>
                    {accuracy != null ? (
                      <>
                        <span className="mx-2 text-cream/40">·</span>
                        <span className="text-gold">{accuracy}% rated Good+</span>
                      </>
                    ) : null}
                    {s.session_duration_seconds ? (
                      <>
                        <span className="mx-2 text-cream/40">·</span>
                        <span>{Math.round(s.session_duration_seconds / 60)} min</span>
                      </>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-navy py-10">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <Link
            href={`/study-guides/${guide.id}`}
            className="text-sm text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Back to {guide.name}
          </Link>
        </div>
      </section>
    </article>
  );
}
