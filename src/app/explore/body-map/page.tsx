import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BeautyBodyMap } from "@/components/body-map/BeautyBodyMap";
import { countServicesByZone, listBodyZones } from "@/lib/body-map/data";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Beauty body map",
  description: "Explore 8 body zones and 42 beauty services — find pros who offer what you need.",
  alternates: { canonical: `${BRAND.url}/explore/body-map` },
};

export default async function BodyMapPage() {
  const zones = await listBodyZones();
  const counts = await countServicesByZone();

  return (
    <article className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-navy font-body text-cream">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Explore", href: "/explore/body-map" },
          { name: "Body map", href: "/explore/body-map" },
        ]}
      />
      <header className="border-b border-gold/15 bg-navy py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <h1 className="font-heading text-4xl font-black text-gold md:text-5xl">Beauty body map</h1>
          <p className="mt-4 max-w-2xl text-cream/85">
            Eight zones, 42 services — tap a region to see treatments and find bookable pros on Sif&apos;s Gold.
          </p>
          <Link href="/daily" className="mt-3 inline-block text-sm text-gold hover:underline">
            Daily affirmation →
          </Link>
        </div>
      </header>
      <section className="py-12">
        <div className="mx-auto max-w-content grid gap-10 px-4 sm:px-6 md:px-8 lg:grid-cols-2">
          <BeautyBodyMap serviceCounts={counts} />
          <div>
            <h2 className="font-heading text-xl text-gold">All zones</h2>
            <ul className="mt-4 space-y-2">
              {zones.map((z) => (
                <li key={z.id}>
                  <Link
                    href={`/explore/body-map/${z.id}`}
                    className="flex justify-between rounded-brand border border-gold/15 px-4 py-3 hover:border-gold/35"
                  >
                    <span>{z.name}</span>
                    <span className="text-goldBody">{counts[z.id]} services</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
}
