import type { Metadata } from "next";
import Link from "next/link";
import { addDays, startOfWeek } from "date-fns";
import { format, parseISO } from "date-fns";
import { notFound } from "next/navigation";
import { StaffCommissionForm } from "@/components/salon/StaffCommissionForm";
import {
  getSalonServices,
  getSalonStaff,
  getStaffAppointments,
  getStaffMember,
} from "@/lib/salons/data";
import { calculateStaffPayouts } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const metadata: Metadata = {
  title: "Team member",
  robots: { index: false, follow: false },
};

type Props = { params: { pro_id: string } };

export default async function SalonStaffDetailPage({ params }: Props) {
  const { salon } = await requireSalonDashboardUser();
  const staff = await getStaffMember(salon.id, params.pro_id);
  if (!staff) notFound();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 7);
  const [appointments, services, payoutLines] = await Promise.all([
    getStaffAppointments(staff.pro_id, weekStart, weekEnd),
    getSalonServices(salon.id),
    calculateStaffPayouts(salon.id, weekStart, weekEnd),
  ]);

  const payout = payoutLines.find((p) => p.staff_id === staff.id);
  const allStaff = await getSalonStaff(salon.id);

  return (
    <div className="space-y-8">
      <nav className="font-body text-sm text-gold-body">
        <Link href="/dashboard/salon/team" className="hover:text-gold">
          Team
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">{staff.display_name}</span>
      </nav>

      <header>
        <h1 className="font-heading text-2xl text-gold">{staff.display_name}</h1>
        <p className="mt-1 font-body text-sm capitalize text-gold-body">
          {staff.role} · {staff.status}
        </p>
        {staff.username ? (
          <Link href={`/${staff.username}`} className="mt-2 inline-block font-body text-sm text-gold hover:underline">
            View public profile →
          </Link>
        ) : null}
      </header>

      <StaffCommissionForm salonId={salon.id} staff={staff} />

      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">This week&apos;s earnings</h2>
        <p className="font-body text-cream">
          Gross ${payout?.gross_revenue.toFixed(2) ?? "0.00"} · Net owed ${payout?.net_owed.toFixed(2) ?? "0.00"}
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">Salon services</h2>
        <ul className="font-body text-sm text-cream/80">
          {services.map((s) => (
            <li key={s.id}>{s.name} — ${s.price_amount}</li>
          ))}
        </ul>
        <p className="mt-2 font-body text-xs text-gold-body">
          Per-pro price overrides can be configured in a future release.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg text-gold">Calendar (read-only)</h2>
        <ul className="space-y-2">
          {appointments.length === 0 ? (
            <li className="font-body text-sm text-gold-body">No bookings this week.</li>
          ) : (
            appointments.map((a) => (
              <li key={a.id} className="rounded-brand-sm border border-gold/15 px-3 py-2 font-body text-sm text-cream">
                {format(parseISO(a.scheduled_start), "EEE M/d h:mm a")} — {a.client_name}
                {a.service_name ? ` · ${a.service_name}` : ""}
              </li>
            ))
          )}
        </ul>
      </section>

      <p className="font-body text-xs text-gold-body">
        Salon has {allStaff.length} team member{allStaff.length === 1 ? "" : "s"} on roster.
      </p>
    </div>
  );
}
