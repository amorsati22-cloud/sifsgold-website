import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { getPublicProProfileByUsername } from "@/lib/pro-profiles";
import type { Credential } from "@/types/pro-profile";

type PageProps = {
  params: { username: string };
};

type CredentialType = Credential["type"];

function formatType(type: CredentialType): string {
  const map: Record<CredentialType, string> = {
    license: "License",
    certification: "Certification",
    continuing_education: "Continuing education",
    award: "Award",
  };
  return map[type];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) return { title: "Credentials not found" };
  const title = `${bundle.profile.display_name} — Credentials`;
  return {
    title,
    description: `Licenses and certifications for ${bundle.profile.display_name}.`,
    alternates: { canonical: `/${bundle.profile.username}/credentials` },
    openGraph: { title, url: `${BRAND.url}/${bundle.profile.username}/credentials` },
  };
}

export default async function ProCredentialsPage({ params }: PageProps) {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) notFound();

  const { profile, credentials } = bundle;

  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col sm:-mx-6 md:-mx-8">
      <a href="#credentials-main" className="skip-link">
        Skip to credentials
      </a>
      <div className="border-b border-gold/10 bg-navy-deep/60 py-8">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <nav aria-label="Breadcrumb" className="font-body text-sm text-gold-body">
            <Link href={`/${profile.username}`} className="hover:text-gold">
              {profile.display_name}
            </Link>
            <span className="mx-2 text-cream/40">/</span>
            <span className="text-cream">Credentials</span>
          </nav>
          <h1 id="credentials-main" className="mt-3 font-heading text-3xl text-gold">
            Credentials
          </h1>
          {profile.license_verified ? (
            <p className="mt-3 flex items-center gap-2 font-body text-sm text-teal">
              <BadgeCheck className="h-4 w-4" aria-hidden />
              Primary license verified on Sif&apos;s Gold
              {profile.license_state ? ` (${profile.license_state})` : ""}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 md:px-8">
        {credentials.length === 0 ? (
          <p className="font-body text-cream/70">No public credentials listed.</p>
        ) : (
          <ul className="list-none space-y-4 p-0">
            {credentials.map((cred) => (
              <li key={cred.id} className="rounded-brand-lg border border-gold/10 bg-navy/50 p-5">
                <p className="font-body text-xs uppercase tracking-wide text-gold-body">{formatType(cred.type)}</p>
                <h2 className="mt-1 font-heading text-xl text-cream">{cred.name}</h2>
                {cred.issuing_authority ? (
                  <p className="mt-2 font-body text-sm text-cream/75">{cred.issuing_authority}</p>
                ) : null}
                <dl className="mt-3 grid gap-1 font-body text-sm text-cream/60 sm:grid-cols-2">
                  {cred.issue_date ? (
                    <>
                      <dt>Issued</dt>
                      <dd>{cred.issue_date}</dd>
                    </>
                  ) : null}
                  {cred.expiry_date ? (
                    <>
                      <dt>Expires</dt>
                      <dd>{cred.expiry_date}</dd>
                    </>
                  ) : null}
                </dl>
                {cred.verification_url ? (
                  <a
                    href={cred.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Verification link
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
