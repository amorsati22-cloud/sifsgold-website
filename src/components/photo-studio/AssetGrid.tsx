import Image from "next/image";
import Link from "next/link";
import type { PhotoStudioAsset } from "@/types/photo-studio";

export function AssetGrid({ assets }: { assets: PhotoStudioAsset[] }) {
  if (assets.length === 0) {
    return (
      <p className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-8 text-center font-body text-sm text-cream/70">
        No projects yet. Start with a before/after slider or single edit.
      </p>
    );
  }

  return (
    <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-4">
      {assets.map((asset) => {
        const src = asset.edited_image_url || asset.after_image_url || asset.original_image_url;
        const href =
          asset.type === "before_after"
            ? "/dashboard/photo-studio/before-after"
            : `/dashboard/photo-studio/edit/${asset.id}`;
        return (
          <li key={asset.id}>
            <Link
              href={href}
              className="block overflow-hidden rounded-brand-md border border-gold/15 bg-navy-deep transition hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <div className="relative aspect-square">
                <Image src={src} alt={asset.name ?? "Studio asset"} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-2">
                <p className="truncate font-body text-xs text-gold">{asset.name ?? asset.type.replace("_", " ")}</p>
                {asset.linked_client_consent ? (
                  <span className="font-body text-[10px] text-teal">Consent on file</span>
                ) : asset.linked_appointment_id ? (
                  <span className="font-body text-[10px] text-goldBody">Consent pending</span>
                ) : null}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
