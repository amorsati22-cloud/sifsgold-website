import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppointmentClientView } from "@/components/booking/AppointmentClientView";
import { evaluateCancellation } from "@/lib/booking/cancellation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Appointment } from "@/types/booking";

export const metadata: Metadata = {
  title: "Your appointment",
  robots: { index: false, follow: false },
};

type PageProps = { params: { id: string } };

export default async function BookingDetailPage({ params }: PageProps) {
  const admin = createAdminClient();
  if (!admin) notFound();

  const { data } = await admin
    .from("appointments")
    .select("*, services(name, cancellation_policy), pro_profiles(display_name, username)")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();

  const service = data.services as { name: string; cancellation_policy: string | null } | null;
  const pro = data.pro_profiles as { display_name: string; username: string } | null;

  const eligibility = evaluateCancellation(
    service?.cancellation_policy,
    data.scheduled_start as string,
  );

  const appointment = {
    ...(data as Appointment),
    service_name: service?.name,
    pro_display_name: pro?.display_name,
    pro_username: pro?.username,
    cancellation_policy: service?.cancellation_policy,
  };

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">Appointment</span>
      </nav>
      <h1 className="mb-8 font-heading text-3xl text-gold">Your appointment</h1>
      <AppointmentClientView
        appointment={appointment}
        canCancel={eligibility.canCancel && data.status === "confirmed"}
        cancelMessage={eligibility.message}
      />
    </div>
  );
}
