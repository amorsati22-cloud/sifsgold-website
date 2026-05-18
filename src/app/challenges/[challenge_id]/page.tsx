import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { joinChallenge } from "@/lib/challenges/actions";
import { SPONSORED_FTC_BADGE } from "@/lib/challenges/constants";
import {
  getApprovedCheckIns,
  getChallenge,
  getLeaderboard,
  getUserParticipation,
} from "@/lib/challenges/data";
import { BRAND } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

type Props = { params: { challenge_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getChallenge(params.challenge_id);
  if (!c) return { title: "Challenge" };
  return { title: c.name, alternates: { canonical: `${BRAND.url}/challenges/${c.id}` } };
}

async function JoinButton({ challengeId, joined }: { challengeId: string; joined: boolean }) {
  if (joined) {
    return (
      <Link
        href={`/challenges/${challengeId}/check-in`}
        className="inline-flex rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy"
      >
        Check in today
      </Link>
    );
  }
  return (
    <form
      action={async () => {
        "use server";
        await joinChallenge(challengeId);
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-navy"
      >
        Join challenge (free)
      </button>
    </form>
  );
}

export default async function ChallengeDetailPage({ params }: Props) {
  const challenge = await getChallenge(params.challenge_id);
  if (!challenge) notFound();

  const supabase = await createClient();
  let joined = false;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) joined = Boolean(await getUserParticipation(user.id, challenge.id));
  }

  const checkIns = await getApprovedCheckIns(challenge.id);
  const leaderboard = await getLeaderboard(challenge.id);

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Challenges", href: "/challenges" },
          { name: challenge.name, href: `/challenges/${challenge.id}` },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-3xl font-black text-gold">{challenge.name}</h1>
          <p className="mt-3 max-w-2xl text-cream/85">{challenge.description}</p>
          <p className="mt-2 text-sm text-goldBody">
            {challenge.duration_days} days · {challenge.participant_count} participants
            {challenge.prize ? ` · Prize: ${challenge.prize}` : ""}
          </p>
          {challenge.ftc_disclosure_required ? (
            <p className="mt-3 rounded-brand border border-gold/30 bg-gold/10 p-3 text-xs text-cream/80">
              {SPONSORED_FTC_BADGE}
            </p>
          ) : null}
          <div className="mt-6">
            <JoinButton challengeId={challenge.id} joined={joined} />
          </div>
        </div>
      </header>

      <section className="py-12">
        <div className="mx-auto max-w-content grid gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl text-gold">Daily prompts</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-cream/85">
              {challenge.daily_prompts.map((d) => (
                <li key={d.day}>
                  <span className="font-medium text-gold">Day {d.day}: {d.title}</span>
                  <p className="text-cream/75">{d.prompt}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-xl text-gold">Leaderboard</h2>
              <p className="text-xs text-cream/55">First names only</p>
              <ol className="mt-3 space-y-1 text-sm">
                {leaderboard.map((row, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{row.firstName}</span>
                    <span className="text-gold">{row.days} days</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="font-heading text-xl text-gold">Recent check-ins</h2>
              {checkIns.length === 0 ? (
                <p className="mt-2 text-sm text-cream/60">Be the first to check in.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-sm text-cream/80">
                  {checkIns.map((c) => (
                    <li key={c.id}>{c.caption ?? `Day ${c.day_number}`}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
