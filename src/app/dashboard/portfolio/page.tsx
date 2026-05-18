import type { Metadata } from "next";
import { PortfolioManager } from "@/components/dashboard/PortfolioManager";
import { getDashboardPortfolio, requireProDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Portfolio",
  robots: { index: false, follow: false },
};

export default async function DashboardPortfolioPage() {
  const { user } = await requireProDashboardUser();
  const items = await getDashboardPortfolio(user.id);
  return <PortfolioManager proId={user.id} initialItems={items} />;
}
