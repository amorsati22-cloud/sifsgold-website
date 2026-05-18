import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CheckInForm } from "@/components/challenges/CheckInForm";
import { getChallenge, getUserParticipation } from "@/lib/challenges/data";
import { createClient } from "@/lib/supabase/server";

type Props = { params: { challenge_id: string } };

export const metadata: Metadata = { title: "Check in", robots: { index: false } };

export default async function CheckInPage({ params }: Props) {
  const challenge = await getChallenge(params.challenge_id);
  if (!challenge) notFound();

  const supabase = await createClient();
  if (!supabase) redirect(`/sign-in?next=/challenges/${challenge.id}/check-in`);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?next=/challenges/${challenge.id}/check-in`);

  const part = await getUserParticipation(user.id, challenge.id);
  if (!part) redirect(`/challenges/${challenge.id}`);

  const dayNumber = Math.min(part.days_completed + 1, challenge.duration_days);
  const prompt =
    challenge.daily_prompts.find((d) => d.day === dayNumber)?.prompt ??
    "Share how you showed up today — focus on care, not comparison.";

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream py-12">
      <Breadcrumb
        items={[
          { name: "Challenges", href: "/challenges" },
          { name: challenge.name, href: `/challenges/${challenge.id}` },
          { name: "Check in", href: `/challenges/${challenge.id}/check-in` },
        ]}
      />
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h1 className="font-heading text-2xl text-gold">Check in — day {dayNumber}</h1>
        <CheckInForm challengeId={challenge.id} dayNumber={dayNumber} prompt={prompt} />
      </div>
    </article>
  );
}
