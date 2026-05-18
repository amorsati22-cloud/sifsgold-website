import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserChallenges, getUserCheckIns } from "@/lib/challenges/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My challenges", robots: { index: false } };

export default async function DashboardChallengesPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/sign-in?next=/dashboard/challenges");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard/challenges");

  const { active, completed } = await getUserChallenges(user.id);

  return (
    <div className="mx-auto max-w-content space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl text-gold">My challenges</h1>
        <Link href="/challenges" className="mt-2 inline-block text-sm text-gold hover:underline">
          Browse all challenges
        </Link>
      </div>
      <section>
        <h2 className="font-heading text-lg text-gold">Active</h2>
        {active.length === 0 ? (
          <p className="mt-2 text-sm text-cream/70">You have not joined a challenge yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {active.map(({ participant, challenge }) => (
              <li key={challenge.id} className="rounded-brand-lg border border-gold/20 p-4">
                <Link href={`/challenges/${challenge.id}`} className="font-medium text-gold hover:underline">
                  {challenge.name}
                </Link>
                <p className="text-sm text-cream/70">
                  Progress: {participant.days_completed} / {challenge.duration_days} days
                </p>
                <Link href={`/challenges/${challenge.id}/check-in`} className="mt-2 inline-block text-xs text-gold">
                  Check in →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      {completed.length > 0 ? (
        <section>
          <h2 className="font-heading text-lg text-gold">Completed</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {completed.map(({ challenge }) => (
              <li key={challenge.id}>{challenge.name}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {checkIns.length > 0 ? (
        <section>
          <h2 className="font-heading text-lg text-gold">Past check-ins</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {checkIns.map((c) => (
              <li key={c.id as string}>
                {(c.beauty_challenges as { name: string } | null)?.name ?? "Challenge"} — day {c.day_number as number}
                {c.approved === false ? " (pending review)" : ""}
                {c.caption ? `: ${c.caption as string}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
