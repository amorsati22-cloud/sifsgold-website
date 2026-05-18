"use client";

import { useEffect, useState } from "react";
import { ProAvatarCard } from "@/components/client-dashboard/ProAvatarCard";
import type { ProSummary } from "@/types/client-dashboard";

export function DiscoverNearYou({ initialPros }: { initialPros: ProSummary[] }) {
  const [pros, setPros] = useState(initialPros);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await fetch(
          `/api/client/discover?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.pros?.length) setPros(data.pros);
        setStatus("Sorted by distance from you");
      },
      () => setStatus("Showing popular pros in your area"),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, []);

  return (
    <section>
      {status ? <p className="mb-3 font-body text-xs text-gold-body">{status}</p> : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {pros.map((pro) => (
          <ProAvatarCard key={pro.id} pro={pro} compact />
        ))}
      </div>
    </section>
  );
}
