import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SavedAffirmationsClient } from "@/components/affirmations/SavedAffirmationsClient";
import { getAffirmationUser, getSavedAffirmations } from "@/lib/affirmations/data";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Saved affirmations",
  alternates: { canonical: `${BRAND.url}/daily/saved` },
};

export default async function SavedAffirmationsPage() {
  const { user } = await getAffirmationUser();
  if (!user) redirect("/sign-in?next=/daily/saved");

  const saved = await getSavedAffirmations(user.id);

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Daily", href: "/daily" },
          { name: "Saved", href: "/daily/saved" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-3xl font-black text-gold">Saved affirmations</h1>
          <Link href="/daily" className="mt-3 inline-block text-sm text-gold hover:underline">
            ← Back to daily
          </Link>
        </div>
      </header>
      <section className="py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <SavedAffirmationsClient items={saved.map((s) => s.affirmation)} />
        </div>
      </section>
    </article>
  );
}
