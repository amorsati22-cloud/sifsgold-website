/** Audience landings for licensed professionals and solo pros — show services menu preview. */
export const PRO_AUDIENCE_SLUGS = [
  "for-pros",
  "for-students",
  "for-barbers",
  "for-tattoo-artists",
  "for-nail-techs",
  "for-lash-artists",
  "for-brow-artists",
  "for-massage-therapists",
  "for-makeup-artists",
  "for-estheticians",
  "for-medspa-providers",
  "for-trainers",
  "for-models",
  "for-solo-studios",
] as const;

export function isProAudienceSlug(slug: string): boolean {
  return (PRO_AUDIENCE_SLUGS as readonly string[]).includes(slug);
}
