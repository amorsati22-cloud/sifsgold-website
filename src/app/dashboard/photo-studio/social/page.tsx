import { SocialComposer } from "@/components/photo-studio/SocialComposer";
import { requireProDashboardUser } from "@/lib/dashboard";

export default async function SocialPostPage() {
  const { user } = await requireProDashboardUser();
  return <SocialComposer userId={user.id} />;
}
