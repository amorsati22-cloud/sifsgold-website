import type { Metadata } from "next";
import { ProAvatarCard } from "@/components/client-dashboard/ProAvatarCard";
import { RemoveFavoriteButton } from "@/components/client-dashboard/RemoveFavoriteButton";
import { getClientFavorites } from "@/lib/client-dashboard/data";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export const metadata: Metadata = {
  title: "Favorites",
  robots: { index: false, follow: false },
};

export default async function ClientFavoritesPage() {
  const { user } = await requireClientDashboardUser();
  const favorites = await getClientFavorites(user.id);

  return (
    <div className="space-y-6">
      {favorites.length === 0 ? (
        <p className="font-body text-gold-body">Save pros you love from their public profile.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) =>
            f.pro ? (
              <li key={f.id} className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <RemoveFavoriteButton proId={f.pro_id} />
                </div>
                <ProAvatarCard pro={f.pro} />
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
