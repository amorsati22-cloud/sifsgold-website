"use client";

import { FavoriteToggle } from "@/components/client-dashboard/FavoriteToggle";
import { TrackProView } from "@/components/client-dashboard/TrackProView";

type Props = {
  proId: string;
  initialFavorited?: boolean;
};

export function ProProfileClientActions({ proId, initialFavorited = false }: Props) {
  return (
    <>
      <TrackProView proId={proId} />
      <FavoriteToggle proId={proId} initialFavorited={initialFavorited} />
    </>
  );
}
