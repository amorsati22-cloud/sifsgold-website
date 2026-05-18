import type { Metadata } from "next";
import { SalonInventoryManager } from "@/components/salon/SalonInventoryManager";
import { getSalonInventory } from "@/lib/salons/data";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";

export const metadata: Metadata = {
  title: "Inventory",
  robots: { index: false, follow: false },
};

export default async function SalonInventoryPage() {
  const { salon } = await requireSalonDashboardUser();
  const items = await getSalonInventory(salon.id);

  return (
    <div className="space-y-4">
      <p className="font-body text-sm text-gold-body">
        Track shared products, set reorder points, and log usage across your team.
      </p>
      <SalonInventoryManager salonId={salon.id} initialItems={items} />
    </div>
  );
}
