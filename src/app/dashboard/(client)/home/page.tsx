import type { Metadata } from "next";
import Link from "next/link";
import { AppointmentCard } from "@/components/client-dashboard/AppointmentCard";
import { DiscoverNearYou } from "@/components/client-dashboard/DiscoverNearYou";
import { ProAvatarCard } from "@/components/client-dashboard/ProAvatarCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { getBookingUrl } from "@/lib/booking";
import {
  discoverPros,
  getClientAppointments,
  getClientFavorites,
  getLastCompletedAppointment,
  getRecentlyViewedPros,
} from "@/lib/client-dashboard/data";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export const metadata: Metadata = {
  title: "Home",
  robots: { index: false, follow: false },
};

export default async function ClientHomePage() {
  const { user } = await requireClientDashboardUser();
  const email = user.email ?? undefined;

  const [upcoming, favorites, recent, discover, lastAppt] = await Promise.all([
    getClientAppointments(user.id, { upcomingOnly: true, limit: 3, email }),
    getClientFavorites(user.id),
    getRecentlyViewedPros(user.id),
    discoverPros({ limit: 8 }),
    getLastCompletedAppointment(user.id, email),
  ]);

  const lastPro = lastAppt?.pro_profiles as { username: string; display_name: string } | null;
  const lastService = lastAppt?.services as { id: string; name: string } | null;

  return (
    <div className="space-y-12">
      {lastPro && lastService ? (
        <section className="rounded-brand-lg border border-gold/25 bg-gold/10 p-5">
          <h2 className="font-heading text-lg text-gold">Repeat last appointment</h2>
          <p className="mt-1 font-body text-sm text-cream/80">
            {lastService.name} with {lastPro.display_name}
          </p>
          <GoldButton
            label="Book again"
            href={getBookingUrl(lastPro.username, lastService.id)}
            variant="solid"
            size="md"
            className="mt-4"
          />
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-heading text-xl text-gold">Upcoming</h2>
          <Link href="/dashboard/appointments" className="font-body text-sm text-gold hover:underline">
            View all
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="font-body text-sm text-gold-body">
            No upcoming appointments.{" "}
            <Link href="/dashboard/discover" className="text-gold underline">
              Find a pro
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((a) => (
              <li key={a.id}>
                <AppointmentCard appointment={a} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-heading text-xl text-gold">Favorite pros</h2>
          <Link href="/dashboard/favorites" className="font-body text-sm text-gold hover:underline">
            See all
          </Link>
        </div>
        {favorites.length === 0 ? (
          <p className="font-body text-sm text-gold-body">Heart a pro on their profile to save them here.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {favorites.slice(0, 4).map((f) => (f.pro ? <ProAvatarCard key={f.id} pro={f.pro} compact /> : null))}
          </div>
        )}
      </section>

      {recent.length > 0 ? (
        <section>
          <h2 className="mb-4 font-heading text-xl text-gold">Recently viewed</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {recent.map((pro) => (
              <ProAvatarCard key={pro.id} pro={pro} compact />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-heading text-xl text-gold">Discover</h2>
          <Link href="/dashboard/discover" className="font-body text-sm text-gold hover:underline">
            Search all
          </Link>
        </div>
        <DiscoverNearYou initialPros={discover} />
      </section>
    </div>
  );
}
