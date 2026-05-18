import Link from "next/link";
import { ExternalLink, Instagram } from "lucide-react";
import { formatLocation } from "@/lib/pro-profiles";
import type { ProProfile } from "@/types/pro-profile";

export function ProSocialFooter({ profile }: { profile: ProProfile }) {
  const location = formatLocation(profile);
  const socials = [
    profile.instagram_handle
      ? {
          label: "Instagram",
          href: `https://instagram.com/${profile.instagram_handle.replace(/^@/, "")}`,
          icon: Instagram,
        }
      : null,
    profile.tiktok_handle
      ? {
          label: "TikTok",
          href: `https://tiktok.com/@${profile.tiktok_handle.replace(/^@/, "")}`,
        }
      : null,
    profile.pinterest_handle
      ? {
          label: "Pinterest",
          href: `https://pinterest.com/${profile.pinterest_handle.replace(/^@/, "")}`,
        }
      : null,
    profile.website_url ? { label: "Website", href: profile.website_url } : null,
  ].filter(Boolean) as { label: string; href: string; icon?: typeof Instagram }[];

  if (!location && socials.length === 0) return null;

  return (
    <footer className="bg-navy py-10">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        {location ? (
          <p className="font-body text-sm text-cream/80">
            <span className="text-gold">Location:</span> {location}
            {profile.location_country && profile.location_country !== "US"
              ? `, ${profile.location_country}`
              : ""}
          </p>
        ) : null}
        {socials.length > 0 ? (
          <ul className="mt-4 flex list-none flex-wrap gap-4 p-0">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-sm text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  {s.icon ? <s.icon className="h-4 w-4" aria-hidden /> : <ExternalLink className="h-4 w-4" aria-hidden />}
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-6 font-body text-xs text-cream/50">
          Profile on{" "}
          <Link href="/" className="text-gold-body hover:text-gold">
            Sif&apos;s Gold
          </Link>
          . Bookings and messages are handled in the app with privacy controls you set in your dashboard.
        </p>
      </div>
    </footer>
  );
}
