import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MasteryChart } from "@/components/study-guides/MasteryChart";
import { getStudyAnalytics, getStudyUser } from "@/lib/study-guides/data";

export const metadata: Metadata = {
  title: "Study progress",
  robots: { index: false, follow: false },
};

export default async function StudyProgressPage() {
  const { user } = await getStudyUser();
  if (!user) redirect("/sign-in?next=/dashboard/study-progress");

  const analytics = await getStudyAnalytics(user.id);
  const streak = analytics.streak;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl text-gold md:text-3xl">Study progress</h1>
        <p className="mt-2 font-body text-sm text-cream/80">
          Spaced repetition analytics across your flashcard decks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current streak" value={`${streak?.current_streak_days ?? 0} days`} />
        <StatCard label="Longest streak" value={`${streak?.longest_streak_days ?? 0} days`} />
        <StatCard label="Cards mastered" value={String(streak?.total_cards_mastered ?? 0)} />
        <StatCard
          label="Study time"
          value={`${streak?.total_study_minutes ?? 0} min`}
        />
      </div>

      <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
        <h2 className="font-heading text-lg text-gold">Due today</h2>
        <p className="mt-2 font-heading text-3xl text-cream">{analytics.dueTodayCount}</p>
        <p className="mt-1 text-sm text-cream/70">Cards needing review (including new cards)</p>
        <Link
          href="/study-guides"
          className="mt-4 inline-block text-sm text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Study now →
        </Link>
      </section>

      <section className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
        <h2 className="font-heading text-lg text-gold">Mastery by topic</h2>
        <div className="mt-4">
          <MasteryChart data={analytics.masteryByDeck} />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-4">
      <p className="text-xs uppercase tracking-widest text-cream/60">{label}</p>
      <p className="mt-2 font-heading text-2xl text-gold">{value}</p>
    </div>
  );
}
