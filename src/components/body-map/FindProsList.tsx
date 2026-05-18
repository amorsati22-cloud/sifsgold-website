"use client";

import Link from "next/link";
import { useState } from "react";
import { getBookingUrl } from "@/lib/booking";
import type { ProSummary } from "@/types/client-dashboard";

type Props = {
  serviceId: string;
  serviceName: string;
  initialPros: ProSummary[];
  initialCity?: string;
};

export function FindProsList({ serviceId, serviceName, initialPros, initialCity = "" }: Props) {
  const [city, setCity] = useState(initialCity);
  const [pros, setPros] = useState(initialPros);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const params = new URLSearchParams({ serviceId });
    if (city.trim()) params.set("city", city.trim());
    const res = await fetch(`/api/explore/find-pros?${params}`);
    const json = (await res.json()) as { pros: ProSummary[] };
    setPros(json.pros ?? []);
    setLoading(false);
  }

  return (
    <section className="space-y-6">
      <h2 className="font-heading text-xl text-gold">Find pros offering {serviceName}</h2>
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="find-city">
          City
        </label>
        <input
          id="find-city"
          type="text"
          placeholder="Your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="min-w-[160px] flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-offwhite focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => void search()}
          className="rounded-full border border-gold bg-gold px-4 py-2 text-sm font-semibold text-navy disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {pros.length === 0 ? (
        <p className="text-sm text-cream/70">
          No pros matched yet — try another city or browse{" "}
          <Link href="/dashboard/discover" className="text-gold hover:underline">
            Discover
          </Link>{" "}
          when signed in.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {pros.map((p) => (
            <li key={p.id} className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-4">
              <p className="font-medium text-gold">{p.display_name ?? p.username}</p>
              <p className="text-xs text-cream/60">
                {[p.location_city, p.location_state].filter(Boolean).join(", ") || "Location not listed"}
              </p>
              {p.headline ? <p className="mt-1 text-sm text-cream/75">{p.headline}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <Link href={`/${p.username}`} className="text-gold hover:underline">
                  Profile
                </Link>
                {p.username ? (
                  <Link href={getBookingUrl(p.username)} className="text-gold hover:underline">
                    Book
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
