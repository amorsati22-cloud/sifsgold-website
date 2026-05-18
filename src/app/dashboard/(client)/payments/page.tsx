import type { Metadata } from "next";
import { PaymentsClient } from "@/components/client-dashboard/PaymentsClient";
import { getClientPaymentHistory } from "@/lib/client-dashboard/data";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export const metadata: Metadata = {
  title: "Payments",
  robots: { index: false, follow: false },
};

export default async function ClientPaymentsPage() {
  const { user } = await requireClientDashboardUser();
  const payments = await getClientPaymentHistory(user.id, user.email ?? undefined);

  return <PaymentsClient payments={payments} />;
}
