import type { Metadata } from "next";
import { ClientsTable } from "@/components/pro-ops/ClientsTable";
import { requireProDashboardUser } from "@/lib/dashboard";
import { aggregateProClients } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Clients",
  robots: { index: false, follow: false },
};

export default async function ProClientsPage() {
  const { user } = await requireProDashboardUser();
  const clients = await aggregateProClients(user.id);

  return (
    <div>
      <p className="mb-6 font-body text-sm text-gold-body">
        {clients.length} client{clients.length === 1 ? "" : "s"} in your book.
      </p>
      <ClientsTable clients={clients} />
    </div>
  );
}
