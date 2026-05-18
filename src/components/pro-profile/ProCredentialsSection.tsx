import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { Credential, ProProfile } from "@/types/pro-profile";

type ProCredentialsSectionProps = {
  profile: ProProfile;
  credentials: Credential[];
  limit?: number;
};

function formatCredentialType(type: Credential["type"]): string {
  const labels: Record<Credential["type"], string> = {
    license: "License",
    certification: "Certification",
    continuing_education: "Continuing education",
    award: "Award",
  };
  return labels[type];
}

export function ProCredentialsSection({
  profile,
  credentials,
  limit = 4,
}: ProCredentialsSectionProps) {
  const visible = credentials.slice(0, limit);
  if (visible.length === 0 && !profile.license_verified) return null;

  return (
    <section className="border-b border-gold/10 bg-navy py-12 md:py-14" aria-labelledby="pro-credentials-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 id="pro-credentials-heading" className="font-heading text-2xl text-gold md:text-3xl">
          Credentials
        </h2>
        {profile.license_verified ? (
          <p className="mt-2 flex items-center gap-2 font-body text-sm text-teal">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            License verified on Sif&apos;s Gold
          </p>
        ) : null}
        <ul className="mt-6 list-none space-y-3 p-0">
          {visible.map((cred) => (
            <li
              key={cred.id}
              className="rounded-brand-md border border-gold/10 bg-navy-deep/50 px-4 py-3"
            >
              <p className="font-body text-xs uppercase tracking-wide text-gold-body">
                {formatCredentialType(cred.type)}
              </p>
              <p className="font-heading text-lg text-cream">{cred.name}</p>
              {cred.issuing_authority ? (
                <p className="mt-1 font-body text-sm text-cream/70">{cred.issuing_authority}</p>
              ) : null}
              {cred.verification_url ? (
                <a
                  href={cred.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-body text-sm text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Verify credential
                </a>
              ) : null}
            </li>
          ))}
        </ul>
        {credentials.length > limit ? (
          <p className="mt-6 font-body text-sm">
            <Link
              href={`/${profile.username}/credentials`}
              className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              View all credentials →
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
