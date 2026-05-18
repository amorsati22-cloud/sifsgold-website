import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEmailPreference } from "@/lib/email/preferences";
import { parseEmailToken } from "@/lib/email/signing";
import { EmailPreferencesClient } from "@/app/email-preferences/EmailPreferencesClient";

export const metadata: Metadata = {
  title: "Email preferences",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: { token?: string };
};

export default async function EmailPreferencesPage({ searchParams }: PageProps) {
  const token = searchParams.token;
  if (!token) {
    notFound();
  }

  const payload = parseEmailToken(token);
  if (!payload || payload.purpose !== "preferences") {
    notFound();
  }

  const pref = await getEmailPreference(payload.email);

  return (
    <div className="min-h-screen bg-navy font-body text-cream">
      <EmailPreferencesClient
        token={token}
        email={payload.email}
        initialOptOut={pref?.marketingOptOut ?? false}
      />
    </div>
  );
}
