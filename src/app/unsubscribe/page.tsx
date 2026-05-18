import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setMarketingOptOut } from "@/lib/email/preferences";
import { createEmailToken, parseEmailToken } from "@/lib/email/signing";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: { token?: string };
};

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const token = searchParams.token;
  if (!token) {
    notFound();
  }

  const payload = parseEmailToken(token);
  if (!payload || payload.purpose !== "unsubscribe") {
    notFound();
  }

  await setMarketingOptOut(payload.email, true);
  const preferencesToken = createEmailToken(payload.email, "preferences");

  return (
    <div className="min-h-screen bg-navy font-body text-cream">
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6 md:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-gold-body">Unsubscribe</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-cream">You&apos;re unsubscribed</h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-cream/75">
          <span className="text-cream">{payload.email}</span> will no longer receive marketing
          emails from Sif&apos;s Gold. Transactional messages about your account may still arrive when
          required by law or safety.
        </p>
        <p className="mt-8 font-body text-sm">
          <Link href="/" className="font-semibold text-gold underline-offset-4 hover:underline">
            Return to homepage
          </Link>
          {" · "}
          <Link
            href={`/email-preferences?token=${encodeURIComponent(preferencesToken)}`}
            className="text-gold underline-offset-4 hover:underline"
          >
            Email preferences
          </Link>
        </p>
      </div>
    </div>
  );
}
