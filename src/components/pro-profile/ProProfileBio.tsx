import type { ProProfile } from "@/types/pro-profile";

const MAX_BIO_WORDS = 600;

export function ProProfileBio({ profile }: { profile: ProProfile }) {
  if (!profile.bio?.trim()) return null;

  const words = profile.bio.trim().split(/\s+/);
  const truncated = words.length > MAX_BIO_WORDS;
  const text = truncated ? `${words.slice(0, MAX_BIO_WORDS).join(" ")}…` : profile.bio;

  return (
    <section className="border-b border-gold/10 bg-navy py-12 md:py-14" aria-labelledby="pro-bio-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 id="pro-bio-heading" className="font-heading text-2xl text-gold md:text-3xl">
          About
        </h2>
        <p className="mt-4 max-w-3xl whitespace-pre-line font-heading text-base leading-relaxed text-cream/90 md:text-lg">
          {text}
        </p>
        {profile.accessibility_notes ? (
          <p className="mt-4 max-w-3xl font-body text-sm text-gold-body">
            <span className="font-medium text-gold">Accessibility:</span> {profile.accessibility_notes}
          </p>
        ) : null}
        {profile.languages_spoken && profile.languages_spoken.length > 0 ? (
          <p className="mt-3 font-body text-sm text-cream/70">
            Languages: {profile.languages_spoken.join(", ")}
          </p>
        ) : null}
      </div>
    </section>
  );
}
