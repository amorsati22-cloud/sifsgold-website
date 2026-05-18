import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AffirmationFeed } from "@/components/affirmations/AffirmationFeed";
import { getAffirmationUser, getSavedAffirmations, getTodaysAffirmation } from "@/lib/affirmations/data";
import { recordAffirmationShown } from "@/lib/affirmations/actions";
import { BRAND } from "@/lib/constants";
import { AUDIENCE_LABELS } from "@/lib/affirmations/constants";

export const metadata: Metadata = {
  title: "Daily affirmation",
  description: "Positive, original affirmations for beauty pros, students, and clients — no comparison, no shame.",
  alternates: { canonical: `${BRAND.url}/daily` },
};

export default async function DailyAffirmationPage() {
  const { user, audience } = await getAffirmationUser();
  const today = await getTodaysAffirmation(audience);
  if (!today) {
    return (
      <div className="py-20 text-center text-cream">Affirmations loading soon.</div>
    );
  }

  if (user) await recordAffirmationShown(today.id);

  const saved = user ? await getSavedAffirmations(user.id) : [];
  const recentSaved = saved.slice(0, 6);

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Daily affirmation", href: "/daily" },
        ]}
      />

      <header className="border-b border-gold/15 bg-navy py-14 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Daily affirmation</h1>
          <p className="mt-4 max-w-2xl text-cream/85">
            Original, positive words for {AUDIENCE_LABELS[audience].toLowerCase()} — crafted for the beauty
            industry without comparison or body shame.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/daily/saved" className="text-gold hover:underline">
              Saved affirmations
            </Link>
            <Link href="/explore/body-map" className="text-gold hover:underline">
              Beauty body map
            </Link>
          </div>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <AffirmationFeed
            initial={{ id: today.id, text: today.text, category: today.category }}
            audience={audience}
            signedIn={Boolean(user)}
          />
        </div>
      </section>

      {recentSaved.length > 0 ? (
        <section className="border-t border-gold/10 bg-navy-light/20 py-12">
          <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
            <h2 className="font-heading text-xl text-gold">Recently saved</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentSaved.map((row) => (
                <li
                  key={row.id}
                  className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 text-sm text-cream/85"
                >
                  {row.affirmation.text}
                </li>
              ))}
            </ul>
            <Link href="/daily/saved" className="mt-4 inline-block text-sm text-gold hover:underline">
              View all saved →
            </Link>
          </div>
        </section>
      ) : null}
    </article>
  );
}
