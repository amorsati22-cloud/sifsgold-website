import type { Metadata } from "next";
import { DiscoverSearch } from "@/components/client-dashboard/DiscoverSearch";
import { discoverPros } from "@/lib/client-dashboard/data";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export const metadata: Metadata = {
  title: "Discover",
  robots: { index: false, follow: false },
};

const SPECIALTIES = [
  "hair",
  "skin",
  "nail",
  "lash",
  "brow",
  "barber",
  "makeup",
  "medspa",
  "fitness",
  "fashion",
];

export default async function ClientDiscoverPage() {
  await requireClientDashboardUser();
  const pros = await discoverPros({ limit: 24 });

  return <DiscoverSearch initialPros={pros} specialties={SPECIALTIES} />;
}
