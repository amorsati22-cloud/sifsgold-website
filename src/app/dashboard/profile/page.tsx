import type { Metadata } from "next";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";
import { getDashboardProProfile, requireProDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Edit profile",
  robots: { index: false, follow: false },
};

export default async function DashboardProfilePage() {
  const { user } = await requireProDashboardUser();
  const profile = await getDashboardProProfile(user.id);

  return <ProfileEditor initial={profile} userId={user.id} />;
}
