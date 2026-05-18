import Image from "next/image";
import Link from "next/link";
import { GoldButton } from "@/components/ui/GoldButton";
import { getBookingUrl } from "@/lib/booking";
import type { ProSummary } from "@/types/client-dashboard";

type Props = {
  pro: ProSummary;
  showBook?: boolean;
  compact?: boolean;
};

export function ProAvatarCard({ pro, showBook = true, compact = false }: Props) {
  const location = [pro.location_city, pro.location_state].filter(Boolean).join(", ");

  return (
    <article
      className={`flex flex-col items-center rounded-brand-lg border border-gold/15 bg-navy/50 text-center ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <Link
        href={`/${pro.username}`}
        className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      >
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gold/30 bg-navy-deep">
          {pro.avatar_url ? (
            <Image src={pro.avatar_url} alt="" fill className="object-cover" sizes="64px" />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-heading text-xl text-gold">
              {pro.display_name.charAt(0)}
            </span>
          )}
        </div>
        <h3 className={`mt-2 font-heading text-cream ${compact ? "text-sm" : "text-base"}`}>
          {pro.display_name}
        </h3>
        {location ? <p className="mt-0.5 font-body text-xs text-gold-body">{location}</p> : null}
      </Link>
      {showBook && pro.book_status === "fully_open" ? (
        <GoldButton
          label="Book"
          href={getBookingUrl(pro.username)}
          variant="outlined"
          size="sm"
          className="mt-3"
        />
      ) : null}
    </article>
  );
}
