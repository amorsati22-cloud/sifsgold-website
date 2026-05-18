import type { Metadata } from "next";
import Link from "next/link";
import { ProCalendar } from "@/components/booking/ProCalendar";
import { requireProDashboardUser, getDashboardProProfile } from "@/lib/dashboard";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Appointment } from "@/types/booking";

export const metadata: Metadata = {
  title: "Calendar",
  robots: { index: false, follow: false },
};

export default async function DashboardCalendarPage() {
  const { user } = await requireProDashboardUser();
  const profile = await getDashboardProProfile(user.id);
  const admin = createAdminClient();

  let appointments: Appointment[] = [];
  if (admin) {
    const { data } = await admin
      .from("appointments")
      .select("*")
      .eq("pro_id", user.id)
      .order("scheduled_start", { ascending: true })
      .limit(200);
    appointments = (data as Appointment[]) ?? [];
  }

  const timezone = (profile as { timezone?: string } | null)?.timezone ?? "America/Chicago";

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body">
        <Link href="/dashboard/profile" className="hover:text-gold">
          Pro dashboard
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">Calendar</span>
      </nav>
      <h1 className="mb-2 font-heading text-3xl text-gold">Calendar</h1>
      <p className="mb-8 font-body text-sm text-gold-body">
        Appointments update in real time when clients book online.
      </p>
      <ProCalendar proId={user.id} timezone={timezone} initialAppointments={appointments} />
    </div>
  );
}
