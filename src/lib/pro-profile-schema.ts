import { BRAND } from "@/lib/constants";
import { formatLocation } from "@/lib/pro-profiles";
import type { ProProfile, Testimonial } from "@/types/pro-profile";

function socialUrls(profile: ProProfile): string[] {
  const urls: string[] = [];
  if (profile.instagram_handle) {
    urls.push(`https://instagram.com/${profile.instagram_handle.replace(/^@/, "")}`);
  }
  if (profile.tiktok_handle) {
    urls.push(`https://tiktok.com/@${profile.tiktok_handle.replace(/^@/, "")}`);
  }
  if (profile.pinterest_handle) {
    urls.push(`https://pinterest.com/${profile.pinterest_handle.replace(/^@/, "")}`);
  }
  if (profile.website_url) {
    urls.push(profile.website_url);
  }
  return urls;
}

export function generatePersonSchema(profile: ProProfile, testimonials: Testimonial[]) {
  const location = formatLocation(profile);
  const profileUrl = `${BRAND.url}/${profile.username}`;

  const aggregateRating =
    testimonials.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
          ).toFixed(1),
          reviewCount: testimonials.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    alternateName: profile.username,
    url: profileUrl,
    image: profile.avatar_url ?? undefined,
    jobTitle: profile.headline ?? "Licensed beauty professional",
    description: profile.bio?.slice(0, 300) ?? undefined,
    knowsAbout: profile.specialties ?? undefined,
    address: location
      ? {
          "@type": "PostalAddress",
          addressLocality: profile.location_city ?? undefined,
          addressRegion: profile.location_state ?? undefined,
          addressCountry: profile.location_country ?? "US",
        }
      : undefined,
    sameAs: socialUrls(profile),
    aggregateRating,
    worksFor: {
      "@type": "Organization",
      name: BRAND.name,
      url: BRAND.url,
    },
  };
}
