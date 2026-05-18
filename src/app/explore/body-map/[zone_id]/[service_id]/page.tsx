import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FindProsList } from "@/components/body-map/FindProsList";
import { getBodyService, getBodyZone } from "@/lib/body-map/data";
import { findProsForBodyService } from "@/lib/body-map/find-pros";
import { BRAND } from "@/lib/constants";

type Props = {
  params: { zone_id: string; service_id: string };
  searchParams: { city?: string; state?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getBodyService(params.service_id);
  if (!service) return { title: "Service" };
  return {
    title: `${service.service_name} — find pros`,
    alternates: {
      canonical: `${BRAND.url}/explore/body-map/${params.zone_id}/${service.id}`,
    },
  };
}

export default async function ServiceDeepDivePage({ params, searchParams }: Props) {
  const zone = await getBodyZone(params.zone_id);
  const service = await getBodyService(params.service_id);
  if (!zone || !service || service.zone_id !== zone.id) notFound();

  const pros = await findProsForBodyService(service, {
    city: searchParams.city,
    state: searchParams.state,
    limit: 24,
  });

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Body map", href: "/explore/body-map" },
          { name: zone.name, href: `/explore/body-map/${zone.id}` },
          { name: service.service_name, href: `/explore/body-map/${zone.id}/${service.id}` },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-3xl font-black text-gold">{service.service_name}</h1>
          <p className="mt-3 max-w-2xl text-cream/80">{service.description}</p>
          <p className="mt-2 text-sm text-goldBody">
            Typical duration: {service.average_duration_minutes} minutes · {service.average_price_range}{" "}
            (market estimate)
          </p>
        </div>
      </header>

      <section className="py-12">
        <div className="mx-auto max-w-content space-y-10 px-4 sm:px-6 md:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6 lg:col-span-2">
              <h2 className="font-heading text-lg text-gold">What to expect</h2>
              <p className="mt-2 text-sm text-cream/85">{service.what_to_expect}</p>
              <h2 className="mt-6 font-heading text-lg text-gold">Before your appointment</h2>
              <p className="mt-2 text-sm text-cream/85">{service.prep_tips}</p>
              <h2 className="mt-6 font-heading text-lg text-gold">Aftercare</h2>
              <p className="mt-2 text-sm text-cream/85">{service.aftercare}</p>
            </div>
            <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-6">
              <h2 className="font-heading text-lg text-gold">Book on Sif&apos;s Gold</h2>
              <p className="mt-2 text-sm text-cream/75">
                Services link to live pro menus from Wave 4 booking when pros list matching categories.
              </p>
            </div>
          </div>

          <FindProsList
            serviceId={service.id}
            serviceName={service.service_name}
            initialPros={pros}
            initialCity={searchParams.city ?? ""}
          />
        </div>
      </section>
    </article>
  );
}
