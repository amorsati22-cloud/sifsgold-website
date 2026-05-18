import { BatchProcessor } from "@/components/photo-studio/BatchProcessor";
import { getWatermarkTemplates } from "@/lib/photo-studio/data";
import { requireProDashboardUser } from "@/lib/dashboard";

export default async function BatchPage() {
  const { user } = await requireProDashboardUser();
  const templates = await getWatermarkTemplates(user.id);

  return (
    <div>
      <p className="mb-6 font-body text-sm text-cream/80">
        Bulk upload, apply the same watermark to every image, and download a ZIP of edited files.
      </p>
      <BatchProcessor userId={user.id} templates={templates} />
    </div>
  );
}
