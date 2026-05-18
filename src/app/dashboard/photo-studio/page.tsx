import Link from "next/link";
import { AssetGrid } from "@/components/photo-studio/AssetGrid";
import { PhotoConsentPanel } from "@/components/photo-studio/PhotoConsentPanel";
import { NEW_PROJECT_ACTIONS } from "@/lib/photo-studio/constants";
import {
  getCompletedAppointmentsForPro,
  getRecentAssets,
  getWatermarkTemplates,
} from "@/lib/photo-studio/data";
import { requireProDashboardUser } from "@/lib/dashboard";
import { GoldButton } from "@/components/ui/GoldButton";

export default async function PhotoStudioHomePage() {
  const { user } = await requireProDashboardUser();

  const [assets, templates, appointments] = await Promise.all([
    getRecentAssets(user.id),
    getWatermarkTemplates(user.id),
    getCompletedAppointmentsForPro(user.id),
  ]);

  return (
    <div className="space-y-10">
      <section aria-labelledby="new-project-heading">
        <h2 id="new-project-heading" className="font-heading text-xl text-gold">
          New project
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {NEW_PROJECT_ACTIONS.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="block h-full rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-5 transition hover:border-gold/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <p className="font-heading text-gold">{action.label}</p>
                <p className="mt-2 font-body text-sm text-cream/75">{action.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="watermarks-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="watermarks-heading" className="font-heading text-xl text-gold">
            Watermark templates
          </h2>
          <GoldButton label="Manage" href="/dashboard/photo-studio/watermarks" variant="outlined" size="sm" />
        </div>
        {templates.length === 0 ? (
          <p className="mt-3 font-body text-sm text-cream/70">
            Create a default watermark for exports.{" "}
            <Link href="/dashboard/photo-studio/watermarks" className="text-gold underline">
              Add template
            </Link>
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {templates.slice(0, 4).map((t) => (
              <li
                key={t.id}
                className="rounded-full border border-gold/20 px-3 py-1 font-body text-xs text-cream/85"
              >
                {t.name}
                {t.default_template ? " · default" : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <PhotoConsentPanel appointments={appointments} />

      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="font-heading text-xl text-gold">
          Recent assets
        </h2>
        <div className="mt-4">
          <AssetGrid assets={assets} />
        </div>
      </section>
    </div>
  );
}
