import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { NotifyMeForm } from "@/components/state-board/NotifyMeForm";
import { CATEGORY_LABELS, PROGRAM_LABELS } from "@/lib/state-board/constants";
import {
  getAttemptsForExam,
  getCategoryCounts,
  getExam,
  getStateBoardUser,
  isPublishedCombo,
} from "@/lib/state-board/data";
import { STATE_BOARD_STUBS } from "@/data/states";
import { BRAND } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";

type Props = { params: { state: string; program: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stub = STATE_BOARD_STUBS[params.state as keyof typeof STATE_BOARD_STUBS];
  const program = PROGRAM_LABELS[params.program as keyof typeof PROGRAM_LABELS] ?? params.program;
  return {
    title: `${stub?.displayName ?? params.state} ${program} — State board prep`,
    alternates: {
      canonical: `${BRAND.url}/state-board-prep/${params.state}/${params.program}`,
    },
  };
}

export default async function ExamOverviewPage({ params }: Props) {
  const published = isPublishedCombo(params.state, params.program);
  const exam = await getExam(params.state, params.program);
  const stub = STATE_BOARD_STUBS[params.state as keyof typeof STATE_BOARD_STUBS];

  if (!stub) notFound();

  if (!published || !exam) {
    return (
      <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "State board prep", href: "/state-board-prep" },
            { name: stub.displayName, href: `/state-board-prep/${params.state}/${params.program}` },
          ]}
        />
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 md:px-8">
          <h1 className="font-heading text-3xl text-gold">Coming soon</h1>
          <p className="mt-4 text-cream/85">
            {stub.displayName}{" "}
            {PROGRAM_LABELS[params.program as keyof typeof PROGRAM_LABELS] ?? params.program} is not
            published yet.
          </p>
          <NotifyMeForm stateSlug={params.state} program={params.program} />
        </div>
      </article>
    );
  }

  const { user } = await getStateBoardUser();
  const categoryCounts = await getCategoryCounts(exam.id);
  const attempts = user ? await getAttemptsForExam(user.id, exam.id) : [];
  const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "State board prep", href: "/state-board-prep" },
          { name: exam.exam_name, href: `/state-board-prep/${params.state}/${params.program}` },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold">{exam.exam_name}</h1>
          <p className="mt-2 text-sm text-cream/75">{exam.board_name}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-cream/60">Training hours</dt>
              <dd className="font-medium text-cream">{exam.required_hours}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Exam vendor</dt>
              <dd className="font-medium text-cream">{exam.vendor}</dd>
            </div>
            <div>
              <dt className="text-cream/60">Passing score</dt>
              <dd className="font-medium text-cream">{exam.passing_score}%</dd>
            </div>
            <div>
              <dt className="text-cream/60">Time limit (practice)</dt>
              <dd className="font-medium text-cream">{exam.time_limit_minutes} min</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-cream/60">Statute</dt>
              <dd className="font-medium text-cream">{exam.statute_citation}</dd>
            </div>
          </dl>
          <a
            href={exam.official_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-gold hover:underline"
          >
            Official board site →
          </a>
        </div>
      </header>

      <section className="border-b border-gold/10 bg-navy-light/20 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-xl text-gold">Category breakdown</h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <li key={cat} className="flex justify-between text-sm text-cream/85">
                <span>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}</span>
                <span className="text-gold">
                  {count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-xl text-gold">Study modes</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ModeCard
              title="Quick quiz"
              description="10 random questions with explanations."
              href={`/state-board-prep/${params.state}/${params.program}/quiz?mode=quick`}
            />
            <ModeCard
              title="Category focus"
              description="Pick a category — 20 questions."
              href={`/state-board-prep/${params.state}/${params.program}/quiz?mode=category`}
            />
            <ModeCard
              title="Full practice exam"
              description={`${exam.time_limit_minutes}-minute timed exam (${exam.passing_score}% to pass).`}
              href={`/state-board-prep/${params.state}/${params.program}/full-exam`}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gold/10 bg-navy-light/20 py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h2 className="font-heading text-xl text-gold">Past attempts</h2>
          {attempts.length === 0 ? (
            <p className="mt-3 text-sm text-cream/70">No completed attempts yet.</p>
          ) : (
            <ul className="mt-4 list-none space-y-2 p-0">
              {attempts.map((a) => (
                <li
                  key={a.id}
                  className="rounded-brand border border-gold/15 bg-navy-deep/60 px-4 py-3 text-sm"
                >
                  {a.completed_at
                    ? formatDistanceToNow(new Date(a.completed_at), { addSuffix: true })
                    : "In progress"}
                  <span className="mx-2 text-cream/40">·</span>
                  <span className="text-gold">{a.score_percent}%</span>
                  {a.passed != null ? (
                    <span className={a.passed ? " text-emerald-400" : " text-orange-300"}>
                      {a.passed ? " Pass" : " Below passing"}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {user ? (
            <Link
              href="/dashboard/state-board-progress"
              className="mt-6 inline-block text-sm text-gold hover:underline"
            >
              View progress dashboard →
            </Link>
          ) : (
            <p className="mt-6 text-sm text-cream/70">
              <Link href={`/sign-in?next=/state-board-prep/${params.state}/${params.program}`} className="text-gold underline">
                Sign in
              </Link>{" "}
              to save attempts and analytics.
            </p>
          )}
        </div>
      </section>
    </article>
  );
}

function ModeCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-brand-lg border border-gold/25 bg-navy-deep/70 p-5 transition hover:border-gold/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <p className="font-heading text-lg text-gold">{title}</p>
      <p className="mt-2 text-sm text-cream/80">{description}</p>
    </Link>
  );
}
