import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { GoldButton } from "@/components/ui/GoldButton";
import { BookStatusBadge } from "@/components/pro-profile/BookStatusBadge";
import { getBookingUrl } from "@/lib/booking";
import { formatLocation } from "@/lib/pro-profiles";
import type { ProProfile } from "@/types/pro-profile";

type ProProfileHeroProps = {
  profile: ProProfile;
  clientActions?: React.ReactNode;
};

export function ProProfileHero({ profile, clientActions }: ProProfileHeroProps) {
  const location = formatLocation(profile);
  const canBook = profile.book_status !== "closed";
  const bookingLabel =
    profile.book_status === "request_only" ? "Request appointment" : "Book now";

  return (
    <header className="relative overflow-hidden border-b border-gold/10">
      <div
        className="absolute inset-0 bg-navy-deep"
        aria-hidden
        style={
          profile.cover_image_url
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(4,16,30,0.55), rgba(4,16,30,0.92)), url(${profile.cover_image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: "linear-gradient(160deg, #06080F 0%, #04101E 50%, #0A1929 100%)",
              }
        }
      />
      <div className="relative mx-auto max-w-content px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-brand-lg border-2 border-gold/30 bg-navy md:h-36 md:w-36">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 112px, 144px"
                priority
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center font-heading text-4xl text-gold"
                aria-hidden
              >
                {profile.display_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-3xl text-gold md:text-4xl">{profile.display_name}</h1>
              {profile.pronouns ? (
                <span className="font-body text-sm text-cream/60">({profile.pronouns})</span>
              ) : null}
            </div>
            {profile.headline ? (
              <p className="mt-2 font-body text-base text-cream/90 md:text-lg">{profile.headline}</p>
            ) : null}
            {location ? (
              <p className="mt-2 flex items-center gap-1.5 font-body text-sm text-gold-body">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                {location}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {clientActions}
              <BookStatusBadge status={profile.book_status} acceptingNewClients={profile.accepting_new_clients} />
              {profile.years_experience ? (
                <span className="font-body text-xs text-cream/60">
                  {profile.years_experience}+ years experience
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
            {canBook ? (
              <GoldButton
                label={bookingLabel}
                href={getBookingUrl(profile.username)}
                size="lg"
                className="w-full sm:w-auto"
              />
            ) : (
              <span className="rounded-full border border-cream/20 px-5 py-3 text-center font-body text-sm text-cream/60">
                Not accepting bookings
              </span>
            )}
            <Link
              href={`/${profile.username}/portfolio`}
              className="text-center font-body text-sm text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              View full portfolio
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
