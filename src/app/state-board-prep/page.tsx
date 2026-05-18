import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StateBoardHub } from "@/components/state-board/StateBoardHub";
import { ALL_STATE_SLUGS } from "@/data/states";
import { PUBLISHED_STATE_CODES, SLUG_TO_STATE_CODE } from "@/lib/state-board/constants";
import { PUBLISHED_EXAM_SEEDS } from "@/lib/state-board/seed-content";
import {
  getBestScore,
  getStateBoardUser,
  isPublishedCombo,
} from "@/lib/state-board/data";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "State Board Prep",
  description:
    "Per-state cosmetology exam banks with timed practice tests, category analytics, and weak-topic identification.",
  alternates: { canonical: `${BRAND.url}/state-board-prep` },
};

export default async function StateBoardPrepPage() {
  const { user } = await getStateBoardUser();

  const exams = await Promise.all(
    ALL_STATE_SLUGS.flatMap((stateSlug) =>
      (["cosmetology", "barbering", "esthetics", "nail_tech"] as const).map(async (program) => {
        const published = isPublishedCombo(stateSlug, program);
        const seed = published
          ? PUBLISHED_EXAM_SEEDS.find(
              (s) =>
                s.exam.state === SLUG_TO_STATE_CODE[stateSlug] && s.exam.program_type === program,
            )
          : null;
        const bestScore =
          user && seed ? await getBestScore(user.id, seed.exam.id as string) : null;
        return {
          stateSlug,
          stateName: stateSlug,
          program,
          published,
          totalQuestions: seed?.exam.total_questions ?? 0,
          bestScore,
        };
      }),
    ),
  );

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "State board prep", href: "/state-board-prep" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">State board prep</h1>
          <p className="mt-4 max-w-3xl text-lg text-cream/88">
            ~300 state-specific questions per published jurisdiction — hours, exam vendor, passing score,
            and statute citations scoped to your board. No generic cosmetology filler.
          </p>
          <p className="mt-2 text-sm text-goldBody">
            Live now: {PUBLISHED_STATE_CODES.join(", ")} cosmetology. Other states and programs — notify
            me below.
          </p>
        </div>
      </header>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <StateBoardHub exams={exams} userEmail={user?.email} />
        </div>
      </section>
    </article>
  );
}
