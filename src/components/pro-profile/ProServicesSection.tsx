import Link from "next/link";
import { GoldButton } from "@/components/ui/GoldButton";
import { getBookingUrl } from "@/lib/booking";
import { formatPriceCents } from "@/lib/format-price";
import type { ProProfile, ProService } from "@/types/pro-profile";

type ProServicesSectionProps = {
  profile: ProProfile;
  services: ProService[];
  limit?: number;
};

export function ProServicesSection({ profile, services, limit = 6 }: ProServicesSectionProps) {
  const visible = services.slice(0, limit);
  if (visible.length === 0) return null;

  return (
    <section className="border-b border-gold/10 bg-navy-deep/40 py-12 md:py-14" aria-labelledby="pro-services-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <h2 id="pro-services-heading" className="font-heading text-2xl text-gold md:text-3xl">
          Services
        </h2>
        <ul className="mt-6 list-none space-y-3 p-0">
          {visible.map((service) => (
            <li
              key={service.id}
              className="flex flex-col gap-3 rounded-brand-md border border-gold/10 bg-navy/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="font-heading text-lg text-cream">{service.name}</h3>
                {service.description ? (
                  <p className="mt-1 font-body text-sm text-cream/75">{service.description}</p>
                ) : null}
                <p className="mt-2 font-body text-sm text-gold-body">
                  {formatPriceCents(service.price_cents)}
                  {service.duration_minutes ? ` · ${service.duration_minutes} min` : ""}
                </p>
              </div>
              <GoldButton
                label="Book this service"
                href={getBookingUrl(profile.username, service.id)}
                variant="outlined"
                size="sm"
                className="shrink-0"
              />
            </li>
          ))}
        </ul>
        {services.length > limit ? (
          <p className="mt-6 font-body text-sm">
            <Link
              href={`/${profile.username}/services`}
              className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              View full services menu ({services.length}) →
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
