import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FlashcardPlayer } from "@/components/study-guides/FlashcardPlayer";
import {
  getDeckWithGuide,
  getSessionCards,
  getStudyUser,
} from "@/lib/study-guides/data";
import { startStudySession } from "@/lib/study-guides/actions";

export const metadata: Metadata = {
  title: "Study session",
  robots: { index: false, follow: false },
};

type Props = {
  params: { deck_id: string };
  searchParams: { session?: string };
};

export default async function StudySessionPage({ params, searchParams }: Props) {
  const { user } = await getStudyUser();
  if (!user) {
    redirect(`/sign-in?next=/study-guides/study/${params.deck_id}`);
  }

  const row = await getDeckWithGuide(params.deck_id);
  if (!row) redirect("/study-guides");

  let sessionId = searchParams.session;
  if (!sessionId) {
    const started = await startStudySession(params.deck_id);
    if (!started.ok) redirect(`/study-guides/${row.study_guide_id}/${params.deck_id}`);
    sessionId = started.sessionId;
  }

  const cards = await getSessionCards(params.deck_id, user.id);
  const startedAt = new Date().toISOString();

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Study guides", href: "/study-guides" },
          { name: row.study_guides.name, href: `/study-guides/${row.study_guide_id}` },
          { name: row.name, href: `/study-guides/${row.study_guide_id}/${row.id}` },
          { name: "Session", href: `/study-guides/study/${row.id}` },
        ]}
      />

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 md:px-8">
        <h1 className="font-heading text-2xl text-gold md:text-3xl">{row.name}</h1>
        <p className="mt-2 text-sm text-cream/75">
          Rate each card after you flip: Again, Hard, Good, or Easy. Scheduling uses SM-2 spaced repetition.
        </p>
        <div className="mt-8">
          <FlashcardPlayer
            cards={cards}
            deckId={params.deck_id}
            sessionId={sessionId}
            startedAt={startedAt}
            guideId={row.study_guide_id}
          />
        </div>
      </div>
    </article>
  );
}
