import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import { getBookingUrl } from "@/lib/booking";
import { BRAND } from "@/lib/constants";
import { formatPriceCents } from "@/lib/format-price";
import { getPublicProProfileByUsername } from "@/lib/pro-profiles";

type PageProps = {
  params: { username: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) return { title: "Services not found" };
  const title = `${bundle.profile.display_name} — Services`;
  return {
    title,
    description: `Services menu for ${bundle.profile.display_name}. Book directly on Sif's Gold.`,
    alternates: { canonical: `/${bundle.profile.username}/services` },
    openGraph: {
      title,
      url: `${BRAND.url}/${bundle.profile.username}/services`,
    },
  };
}

export default async function ProServicesPage({ params }: PageProps) {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) notFound();

  const { profile, services } = bundle;

  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col sm:-mx-6 md:-mx-8">
      <a href="#services-main" className="skip-link">
        Skip to services menu
      </a>
      <div className="border-b border-gold/10 bg-navy-deep/60 py-8">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <nav aria-label="Breadcrumb" className="font-body text-sm text-gold-body">
            <Link href={`/${profile.username}`} className="hover:text-gold">
              {profile.display_name}
            </Link>
            <span className="mx-2 text-cream/40">/</span>
            <span className="text-cream">Services</span>
          </nav>
          <h1 id="services-main" className="mt-3 font-heading text-3xl text-gold">
            Services menu
          </h1>
          <p className="mt-2 max-w-2xl font-body text-sm text-cream/75">
            Every service books through Sif&apos;s Gold with the privacy and policies you set in your dashboard.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 md:px-8">
        {services.length === 0 ? (
          <p className="font-body text-cream/70">No services listed yet. Check back soon.</p>
        ) : (
          <ul className="list-none space-y-4 p-0">
            {services.map((service) => (
              <li
                key={service.id}
                className="flex flex-col gap-4 rounded-brand-lg border border-gold/10 bg-navy/50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-heading text-xl text-cream">{service.name}</h2>
                  {service.description ? (
                    <p className="mt-2 font-body text-sm text-cream/80">{service.description}</p>
                  ) : null}
                  <p className="mt-2 font-body text-sm text-gold-body">
                    {formatPriceCents(service.price_cents)}
                    {service.duration_minutes ? ` · ${service.duration_minutes} minutes` : ""}
                    {service.category ? ` · ${service.category}` : ""}
                  </p>
                </div>
                <GoldButton
                  label="Book this service"
                  href={getBookingUrl(profile.username, service.id)}
                  size="md"
                />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10">
          <GoldButton label="Book any service" href={getBookingUrl(profile.username)} size="lg" />
        </div>
      </div>
    </div>
  );
}
