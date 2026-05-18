import type { Metadata } from "next";
import { IntakeFormsManager } from "@/components/pro-ops/IntakeFormsManager";
import { requireProDashboardUser } from "@/lib/dashboard";
import { getProIntakeTemplates } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Intake forms",
  robots: { index: false, follow: false },
};

export default async function ProIntakeFormsPage() {
  const { user } = await requireProDashboardUser();
  const templates = await getProIntakeTemplates(user.id);

  return <IntakeFormsManager templates={templates} proId={user.id} />;
}
