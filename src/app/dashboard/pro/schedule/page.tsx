import type { Metadata } from "next";
import Link from "next/link";
import { ProCalendar } from "@/components/booking/ProCalendar";
import { GoldButton } from "@/components/ui/GoldButton";
import { getDashboardProProfile, requireProDashboardUser } from "@/lib/dashboard";
import { getProCalendarAppointments } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Schedule",
  robots: { index: false, follow: false },
};

export default async function ProSchedulePage() {
  const { user } = await requireProDashboardUser();
  const profile = await getDashboardProProfile(user.id);
  const timezone = (profile as { timezone?: string } | null)?.timezone ?? "America/Chicago";
  const appointments = await getProCalendarAppointments(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-body text-sm text-gold-body">Real-time updates when clients book online.</p>
        <GoldButton label="Edit availability" href="/dashboard/availability" variant="outlined" size="sm" />
      </div>
      <ProCalendar proId={user.id} timezone={timezone} initialAppointments={appointments} />
      <p className="font-body text-xs text-gold-body">
        Need the legacy calendar route?{" "}
        <Link href="/dashboard/calendar" className="text-gold underline">
          Open /dashboard/calendar
        </Link>
      </p>
    </div>
  );
}
