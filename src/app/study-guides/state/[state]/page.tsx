import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ALL_STATE_SLUGS, getStateBoardStub } from "@/data/states";
import { SEED_GUIDE_IDS } from "@/lib/study-guides/seed-ids";
import { BRAND } from "@/lib/constants";

type Props = { params: { state: string } };

const STATE_TO_GUIDE: Record<string, string> = {
  tx: SEED_GUIDE_IDS.texas,
  ca: SEED_GUIDE_IDS.california,
  fl: SEED_GUIDE_IDS.florida,
};

export function generateStaticParams(): { state: string }[] {
  return ALL_STATE_SLUGS.map((state) => ({ state }));
}

export function generateMetadata({ params }: Props): Metadata {
  const stub = getStateBoardStub(params.state);
  if (!stub) {
    return { title: "Study guide" };
  }
  return {
    title: `${stub.displayName} study guide`,
    description: `State board orientation for ${stub.displayName}: hours, exam vendor, CE, and statute pointers.`,
    alternates: { canonical: `${BRAND.url}/study-guides/state/${stub.slug}` },
  };
}

export default function StateStudyGuidePage({ params }: Props) {
  const stub = getStateBoardStub(params.state);
  if (!stub) {
    notFound();
  }

  const interactiveGuideId = STATE_TO_GUIDE[stub.slug];

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Study guides", href: "/study-guides" },
          { name: stub.displayName, href: `/study-guides/state/${stub.slug}` },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold/90">Study guide summary</p>
          <h1 className="mt-3 font-heading text-4xl font-black text-gold md:text-5xl">{stub.displayName}</h1>
          <p className="mt-4 max-w-3xl text-cream/85">{stub.boardName}</p>
          {interactiveGuideId ? (
            <Link
              href={`/study-guides/${interactiveGuideId}`}
              className="mt-6 inline-flex rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              Open interactive flashcards
            </Link>
          ) : null}
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-2xl text-gold">License coverage (summary)</h2>
          <p className="mt-3 text-sm text-cream/80">{stub.licenseNames.join(" · ")}</p>
          <dl className="mt-8 grid max-w-3xl gap-4 rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 text-sm">
            <div>
              <dt className="text-cream/60">Cosmetology hours (typical)</dt>
              <dd className="mt-1 font-medium text-cream">{stub.hoursCosmetology}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Exam vendor</dt>
              <dd className="mt-1 font-medium text-cream">{stub.examVendor}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Passing score</dt>
              <dd className="mt-1 font-medium text-cream">{stub.passingScore}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Continuing education</dt>
              <dd className="mt-1 font-medium text-cream">{stub.ceRequirements}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Statute / rule citation</dt>
              <dd className="mt-1 font-medium text-cream">{stub.statuteCitation}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Board name (working)</dt>
              <dd className="mt-1 font-medium text-cream">{stub.boardName}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-navy py-14 md:py-18">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-cream/88">
            Interactive flashcards with spaced repetition are available for select states. Always verify hours,
            vendors, and passing scores with your school and licensing board.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/study-guides"
              className="inline-flex rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              All study guides
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
