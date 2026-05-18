import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/services/ServiceForm";
import { getServiceById, getServiceCategories } from "@/lib/services/data";
import { requireProDashboardUser } from "@/lib/dashboard";

type PageProps = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Edit service",
  robots: { index: false, follow: false },
};

export default async function EditServicePage({ params }: PageProps) {
  const { user } = await requireProDashboardUser();
  const [service, categories] = await Promise.all([
    getServiceById(user.id, params.id),
    getServiceCategories(),
  ]);

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body">
        <Link href="/dashboard/services" className="hover:text-gold">
          Services
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">Edit</span>
      </nav>
      <h1 className="mb-6 font-heading text-2xl text-gold">Edit service</h1>
      <ServiceForm
        proId={user.id}
        categories={categories}
        initial={service}
        serviceId={service.id}
      />
    </div>
  );
}
