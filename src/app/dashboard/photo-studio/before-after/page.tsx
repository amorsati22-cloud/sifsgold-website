import { BeforeAfterCreator } from "@/components/photo-studio/BeforeAfterCreator";
import { getDefaultWatermark } from "@/lib/photo-studio/data";
import { requireProDashboardUser } from "@/lib/dashboard";

export default async function BeforeAfterPage() {
  const { user } = await requireProDashboardUser();
  await getDefaultWatermark(user.id);

  return (
    <div>
      <p className="mb-6 font-body text-sm text-cream/80">
        Upload before and after photos, preview the comparison slider, and export for portfolio or social.
      </p>
      <BeforeAfterCreator userId={user.id} />
    </div>
  );
}
