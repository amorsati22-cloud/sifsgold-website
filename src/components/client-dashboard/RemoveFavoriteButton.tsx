"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RemoveFavoriteButton({ proId }: { proId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    setLoading(true);
    await fetch("/api/client/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pro_id: proId }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void remove()}
      disabled={loading}
      className="rounded-brand-md bg-navy/90 px-2 py-1 font-body text-xs text-gold-body hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      Remove
    </button>
  );
}
