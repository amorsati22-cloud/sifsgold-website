import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServicesMenu } from "@/components/services/ServicesMenu";
import { GoldButton } from "@/components/ui/GoldButton";
import { getBookingUrl } from "@/lib/booking";
import { BRAND } from "@/lib/constants";
import { getPublicProProfileByUsername } from "@/lib/pro-profiles";
import { getServiceCategories, groupServicesByCategory } from "@/lib/services/data";

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
  const categories = await getServiceCategories();
  const groups = groupServicesByCategory(services, categories);

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
            Every service books through Sif&apos;s Gold with the privacy and policies you set in your
            dashboard.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 md:px-8">
        <ServicesMenu username={profile.username} groups={groups} categories={categories} />
        <div className="mt-10">
          <GoldButton label="Book any service" href={getBookingUrl(profile.username)} size="lg" />
        </div>
      </div>
    </div>
  );
}
