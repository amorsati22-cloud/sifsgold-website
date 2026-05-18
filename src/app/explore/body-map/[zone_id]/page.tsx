import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getBodyZone, listZoneServices } from "@/lib/body-map/data";
import { BRAND } from "@/lib/constants";

type Props = { params: { zone_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const zone = await getBodyZone(params.zone_id);
  if (!zone) return { title: "Zone" };
  return {
    title: `${zone.name} — beauty services`,
    alternates: { canonical: `${BRAND.url}/explore/body-map/${zone.id}` },
  };
}

export default async function ZoneServicesPage({ params }: Props) {
  const zone = await getBodyZone(params.zone_id);
  if (!zone) notFound();
  const services = await listZoneServices(zone.id);

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Body map", href: "/explore/body-map" },
          { name: zone.name, href: `/explore/body-map/${zone.id}` },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-3xl font-black text-gold">{zone.name}</h1>
          <p className="mt-3 max-w-2xl text-cream/80">{zone.description}</p>
        </div>
      </header>
      <section className="py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <ul className="grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/explore/body-map/${zone.id}/${s.id}`}
                  className="block h-full rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5 hover:border-gold/40"
                >
                  <p className="font-heading text-lg text-gold">{s.service_name}</p>
                  <p className="mt-2 text-sm text-cream/75">{s.description}</p>
                  <p className="mt-2 text-xs text-goldBody">
                    ~{s.average_duration_minutes} min · {s.average_price_range}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
