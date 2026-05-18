import type { Metadata } from "next";
import { SalonTeamPageClient } from "@/components/salon/SalonTeamPageClient";
import { getSalonStaff } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const metadata: Metadata = {
  title: "Team",
  robots: { index: false, follow: false },
};

export default async function SalonTeamPage() {
  const { salon } = await requireSalonDashboardUser();
  const staff = await getSalonStaff(salon.id);

  return <SalonTeamPageClient salonId={salon.id} staff={staff} />;
}
