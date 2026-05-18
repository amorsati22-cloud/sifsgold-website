import type { Metadata } from "next";
import { ReviewsManager } from "@/components/dashboard/ReviewsManager";
import { getDashboardReviews, requireProDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Reviews",
  robots: { index: false, follow: false },
};

export default async function DashboardReviewsPage() {
  const { user } = await requireProDashboardUser();
  const { pending, approved } = await getDashboardReviews(user.id);
  return <ReviewsManager proId={user.id} pending={pending} approved={approved} />;
}
