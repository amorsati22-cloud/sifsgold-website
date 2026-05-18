import { notFound } from "next/navigation";
import { ImageEditor } from "@/components/photo-studio/ImageEditor";
import { getAssetById, getWatermarkTemplates } from "@/lib/photo-studio/data";
import { requireProDashboardUser } from "@/lib/dashboard";

type Props = { params: Promise<{ asset_id: string }> };

export default async function PhotoEditPage({ params }: Props) {
  const { asset_id } = await params;
  const { user } = await requireProDashboardUser();
  const isNew = asset_id === "new";

  const [asset, templates] = await Promise.all([
    isNew ? Promise.resolve(null) : getAssetById(user.id, asset_id),
    getWatermarkTemplates(user.id),
  ]);

  if (!isNew && !asset) notFound();

  return (
    <div>
      <p className="mb-6 font-body text-sm text-cream/80">
        Crop, adjust, remove backgrounds, and apply watermarks. All processing stays in your browser until you save.
      </p>
      <ImageEditor userId={user.id} asset={asset} isNew={isNew} templates={templates} />
    </div>
  );
}
