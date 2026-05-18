import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import { formatSalonAddress, getPublicSalon } from "@/lib/salons/data";

type Props = { params: { salon_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPublicSalon(params.salon_id);
  if (!data) return { title: "Salon not found" };
  return {
    title: data.salon.name,
    description: data.salon.description ?? `Book at ${data.salon.name} on Sif's Gold.`,
  };
}

export default async function PublicSalonPage({ params }: Props) {
  const data = await getPublicSalon(params.salon_id);
  if (!data) notFound();

  const { salon, staff, services } = data;
  const address = formatSalonAddress(salon);

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      {salon.cover_image_url ? (
        <div
          className="mb-8 h-48 rounded-brand-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${salon.cover_image_url})` }}
          role="img"
          aria-label={`${salon.name} cover`}
        />
      ) : null}

      <header className="mb-10">
        <h1 className="font-heading text-4xl text-gold">{salon.name}</h1>
        {salon.description ? (
          <p className="mt-3 max-w-2xl font-body text-cream/85">{salon.description}</p>
        ) : null}
        {address ? <p className="mt-2 font-body text-sm text-gold-body">{address}</p> : null}
        {salon.phone ? <p className="font-body text-sm text-gold-body">{salon.phone}</p> : null}
        {salon.instagram_handle ? (
          <p className="font-body text-sm text-gold">@{salon.instagram_handle.replace(/^@/, "")}</p>
        ) : null}
      </header>

      <section className="mb-12">
        <h2 className="mb-4 font-heading text-2xl text-gold">Our team</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <li
              key={s.id}
              className="rounded-brand-lg border border-gold/15 bg-navy/30 p-4"
            >
              <p className="font-body font-medium text-cream">{s.display_name}</p>
              <p className="font-body text-xs capitalize text-gold-body">{s.role}</p>
              {s.username ? (
                <Link
                  href={`/${s.username}`}
                  className="mt-2 inline-block font-body text-sm text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  View profile
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {services.length > 0 ? (
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl text-gold">Services</h2>
          <ul className="space-y-2">
            {services.map((svc) => (
              <li
                key={svc.id}
                className="flex justify-between rounded-brand-sm border border-gold/10 px-4 py-3 font-body text-sm"
              >
                <span className="text-cream">{svc.name}</span>
                <span className="text-gold">
                  ${svc.price_amount}
                  {svc.duration_minutes ? ` · ${svc.duration_minutes} min` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="rounded-brand-lg border border-gold/25 bg-gold/10 p-6 text-center">
        <h2 className="font-heading text-xl text-gold">Book any available pro</h2>
        <p className="mt-2 font-body text-sm text-cream/80">
          Choose your stylist when you book — we&apos;ll show who&apos;s open.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {staff
            .filter((s) => s.username && s.can_take_own_bookings)
            .slice(0, 3)
            .map((s) => (
              <GoldButton
                key={s.id}
                label={`Book ${s.display_name?.split(" ")[0] ?? "pro"}`}
                href={`/${s.username}/book`}
                variant="solid"
                size="md"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
