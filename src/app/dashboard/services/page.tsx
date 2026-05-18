import type { Metadata } from "next";
import Link from "next/link";
import { ServicesManager } from "@/components/services/ServicesManager";
import { getServiceCategories, getProServicesForDashboard } from "@/lib/services/data";
import { requireProDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Services menu",
  robots: { index: false, follow: false },
};

export default async function DashboardServicesPage() {
  const { user } = await requireProDashboardUser();
  const [services, categories] = await Promise.all([
    getProServicesForDashboard(user.id),
    getServiceCategories(),
  ]);

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body">
        <Link href="/dashboard/profile" className="hover:text-gold">
          Pro dashboard
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">Services</span>
      </nav>
      <ServicesManager proId={user.id} initialServices={services} categories={categories} />
    </div>
  );
}
