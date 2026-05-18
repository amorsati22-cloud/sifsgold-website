"use client";

import { useState } from "react";
import { ProAvatarCard } from "@/components/client-dashboard/ProAvatarCard";
import type { ProSummary } from "@/types/client-dashboard";

type Props = {
  initialPros: ProSummary[];
  specialties: string[];
};

export function DiscoverSearch({ initialPros, specialties }: Props) {
  const [pros, setPros] = useState(initialPros);
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (specialty) params.set("specialty", specialty);
    if (city) params.set("city", city);
    const res = await fetch(`/api/client/discover?${params.toString()}`);
    const data = await res.json();
    setPros(data.pros ?? []);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setView("list")}
          className={`rounded-full px-3 py-1 font-body text-sm ${view === "list" ? "bg-gold/20 text-gold" : "text-gold-body"}`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setView("map")}
          className={`rounded-full px-3 py-1 font-body text-sm ${view === "map" ? "bg-gold/20 text-gold" : "text-gold-body"}`}
        >
          Map
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name or specialty"
          className="rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
        >
          <option value="">All specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="rounded-brand-lg border border-gold/20 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
        />
        <button
          type="button"
          onClick={() => void search()}
          disabled={loading}
          className="rounded-brand-lg bg-gold px-4 py-2 font-body text-sm font-semibold text-navy hover:bg-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {view === "map" ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-brand-lg border border-gold/15 bg-navy/40 p-8 text-center">
          <p className="font-body text-sm text-gold-body">
            Map view uses your browser location in the mobile app. On web, browse the list or enable
            location on the home screen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pros.map((pro) => (
            <ProAvatarCard key={pro.id} pro={pro} />
          ))}
        </div>
      )}

      {pros.length === 0 && !loading ? (
        <p className="font-body text-sm text-gold-body">No pros match your search.</p>
      ) : null}
    </div>
  );
}
