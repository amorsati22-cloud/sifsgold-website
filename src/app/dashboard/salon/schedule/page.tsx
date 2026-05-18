import type { Metadata } from "next";
import { addDays, startOfWeek } from "date-fns";
import { SalonMasterCalendar } from "@/components/salon/SalonMasterCalendar";
import { getSalonAppointments, getSalonStaff } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const metadata: Metadata = {
  title: "Salon schedule",
  robots: { index: false, follow: false },
};

export default async function SalonSchedulePage() {
  const { salon } = await requireSalonDashboardUser();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const [staff, appointments] = await Promise.all([
    getSalonStaff(salon.id),
    getSalonAppointments(salon.id, weekStart, addDays(weekStart, 7)),
  ]);

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-gold-body">
        Master calendar — drag a booking, then choose a team member to reassign. Clients are notified automatically.
      </p>
      <SalonMasterCalendar
        salonId={salon.id}
        timezone={salon.timezone}
        staff={staff}
        initialAppointments={appointments}
      />
    </div>
  );
}
