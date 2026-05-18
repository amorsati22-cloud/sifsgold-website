import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { logAdminAudit } from "@/lib/admin/audit";
import { requireAdminPage } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { email, admin } = await requireAdminPage();

  await logAdminAudit({
    admin,
    adminEmail: email,
    action: "viewed_admin_overview",
    metadata: { layout: true },
  });

  return <AdminShell email={email}>{children}</AdminShell>;
}
