import { WatermarkManager } from "@/components/photo-studio/WatermarkManager";
import { getWatermarkTemplates } from "@/lib/photo-studio/data";
import { requireProDashboardUser } from "@/lib/dashboard";

export default async function WatermarksPage() {
  const { user } = await requireProDashboardUser();
  const templates = await getWatermarkTemplates(user.id);
  return <WatermarkManager templates={templates} />;
}
