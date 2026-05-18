import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ChallengesHubClient } from "@/components/challenges/ChallengesHubClient";
import { listChallenges, getUserChallengeIds } from "@/lib/challenges/data";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Beauty challenges",
  description: "Body-positive community challenges — self-care, skill building, and creativity without comparison framing.",
  alternates: { canonical: `${BRAND.url}/challenges` },
};

export default async function ChallengesPage() {
  const active = await listChallenges({ activeOnly: true, includePast: false });
  const today = new Date().toISOString().slice(0, 10);
  const archive = (await listChallenges({ includePast: true, activeOnly: false })).filter(
    (c) => !c.active || c.end_date < today,
  );
  let joinedIds: string[] = [];
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) joinedIds = await getUserChallengeIds(user.id);
  }

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Challenges", href: "/challenges" }]} />
      <header className="border-b border-gold/15 bg-navy py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold">Beauty challenges</h1>
          <p className="mt-4 max-w-2xl text-cream/85">
            Join body-positive challenges — no transformation contests, no weight-loss framing. Celebrate craft,
            rest, and community.
          </p>
          <Link href="/dashboard/challenges" className="mt-3 inline-block text-sm text-gold hover:underline">
            My challenges →
          </Link>
        </div>
      </header>
      <section className="py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <ChallengesHubClient challenges={active} joinedIds={joinedIds} />
        </div>
      </section>
      {archive.length > 0 ? (
        <section className="border-t border-gold/10 py-12">
          <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
            <h2 className="font-heading text-xl text-gold">Past challenges</h2>
            <div className="mt-6">
              <ChallengesHubClient challenges={archive} joinedIds={joinedIds} showArchive />
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
