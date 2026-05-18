import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { ProProfile } from "@/types/pro-profile";
import type { ServiceWithAddons } from "@/types/services";

type ProServicesSectionProps = {
  profile: ProProfile;
  services: ServiceWithAddons[];
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
        <ul className="mt-6 list-none space-y-4 p-0">
          {visible.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} username={profile.username} compact />
            </li>
          ))}
        </ul>
        {services.length > limit || services.length > 0 ? (
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
