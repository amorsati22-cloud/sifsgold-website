import type { Metadata } from "next";
import Link from "next/link";
import { AppointmentCard } from "@/components/client-dashboard/AppointmentCard";
import { getClientAppointments } from "@/lib/client-dashboard/data";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export const metadata: Metadata = {
  title: "Appointments",
  robots: { index: false, follow: false },
};

const FILTERS = [
  { href: "/dashboard/appointments", label: "All" },
  { href: "/dashboard/appointments?filter=upcoming", label: "Upcoming" },
  { href: "/dashboard/appointments?status=confirmed", label: "Confirmed" },
  { href: "/dashboard/appointments?status=completed", label: "Past" },
  { href: "/dashboard/appointments?status=cancelled_by_client", label: "Cancelled" },
] as const;

type Props = { searchParams: { filter?: string; status?: string } };

export default async function ClientAppointmentsPage({ searchParams }: Props) {
  const { user } = await requireClientDashboardUser();
  const email = user.email ?? undefined;

  const upcomingOnly = searchParams.filter === "upcoming";
  const appointments = await getClientAppointments(user.id, {
    email,
    upcomingOnly,
    status: searchParams.status,
  });

  const sorted = [...appointments].sort((a, b) => {
    const ta = new Date(a.scheduled_start).getTime();
    const tb = new Date(b.scheduled_start).getTime();
    return upcomingOnly ? ta - tb : tb - ta;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`rounded-full px-3 py-1 font-body text-xs ${
              (searchParams.status ? f.href.includes(searchParams.status) : f.href === "/dashboard/appointments" && !searchParams.filter) ||
              (searchParams.filter === "upcoming" && f.href.includes("upcoming"))
                ? "bg-gold text-navy"
                : "border border-gold/30 text-cream"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <ul className="space-y-3">
        {sorted.map((a) => (
          <li key={a.id}>
            <AppointmentCard appointment={a} />
          </li>
        ))}
      </ul>

      {sorted.length === 0 ? (
        <p className="font-body text-gold-body">
          No appointments yet.{" "}
          <Link href="/dashboard/discover" className="text-gold underline">
            Discover pros
          </Link>
        </p>
      ) : null}
    </div>
  );
}
