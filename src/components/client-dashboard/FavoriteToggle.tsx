"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

type Props = {
  proId: string;
  initialFavorited: boolean;
};

export function FavoriteToggle({ proId, initialFavorited }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/client/favorites", {
      method: favorited ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pro_id: proId }),
    });
    setLoading(false);
    if (res.ok) setFavorited(!favorited);
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className="rounded-full p-2 text-gold transition hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50"
    >
      <Heart className={`h-5 w-5 ${favorited ? "fill-gold" : ""}`} aria-hidden />
    </button>
  );
}
