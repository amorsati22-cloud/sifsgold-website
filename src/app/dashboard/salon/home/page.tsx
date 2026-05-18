import type { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { SalonKpiCards } from "@/components/salon/SalonKpiCards";
import { getSalonHomeOverview } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const metadata: Metadata = {
  title: "Salon overview",
  robots: { index: false, follow: false },
};

export default async function SalonHomePage() {
  const { salon } = await requireSalonDashboardUser();
  const overview = await getSalonHomeOverview(salon);

  const kpis = [
    { label: "Revenue today", value: `$${overview.revenueToday.toFixed(0)}` },
    { label: "Open appointments", value: String(overview.openAppointments.length) },
    { label: "Team working", value: String(overview.teamWorking.length) },
    { label: "Low stock alerts", value: String(overview.lowStock.length) },
  ];

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 font-heading text-xl text-gold">Today at {salon.name}</h2>
        <SalonKpiCards kpis={kpis} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-heading text-lg text-gold">Team status</h3>
          <ul className="space-y-2 font-body text-sm">
            {overview.teamWorking.map((s) => (
              <li key={s.id} className="text-cream">
                <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: s.calendar_color ?? "#D4A843" }} />
                {s.display_name} — working
              </li>
            ))}
            {overview.teamOff.map((s) => (
              <li key={s.id} className="text-gold-body">
                {s.display_name} — off / not booking
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-lg text-gold">Today&apos;s appointments</h3>
          <ul className="space-y-2">
            {overview.openAppointments.length === 0 ? (
              <li className="font-body text-sm text-gold-body">No appointments today.</li>
            ) : (
              overview.openAppointments.map((a) => (
                <li
                  key={a.id}
                  className="rounded-brand-sm border border-gold/15 px-3 py-2 font-body text-sm"
                >
                  <span className="text-gold">{format(parseISO(a.scheduled_start), "h:mm a")}</span>
                  <span className="text-cream"> · {a.client_name}</span>
                  <span className="text-gold-body"> · {a.staff_name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {overview.lowStock.length > 0 ? (
        <section className="rounded-brand-lg border border-amber-500/30 bg-amber-950/20 p-4">
          <h3 className="font-heading text-lg text-gold">Inventory alerts</h3>
          <ul className="mt-2 font-body text-sm text-cream/80">
            {overview.lowStock.map((i) => (
              <li key={i.id}>
                {i.product_name} — {i.quantity_on_hand} {i.unit} left
              </li>
            ))}
          </ul>
          <Link href="/dashboard/salon/inventory" className="mt-2 inline-block font-body text-sm text-gold hover:underline">
            Manage inventory →
          </Link>
        </section>
      ) : null}
    </div>
  );
}
