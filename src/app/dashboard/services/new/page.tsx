import type { Metadata } from "next";
import Link from "next/link";
import { ServiceForm } from "@/components/services/ServiceForm";
import { getServiceCategories } from "@/lib/services/data";
import { requireProDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Add service",
  robots: { index: false, follow: false },
};

export default async function NewServicePage() {
  const { user } = await requireProDashboardUser();
  const categories = await getServiceCategories();

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body">
        <Link href="/dashboard/services" className="hover:text-gold">
          Services
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">New service</span>
      </nav>
      <h1 className="mb-6 font-heading text-2xl text-gold">Add service</h1>
      <ServiceForm proId={user.id} categories={categories} />
    </div>
  );
}
