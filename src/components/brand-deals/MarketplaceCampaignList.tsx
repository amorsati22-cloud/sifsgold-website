"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/brand-deals/format";

export type MarketplaceCampaign = {
  id: string;
  title: string;
  description: string;
  per_advocate_compensation: number;
  application_deadline: string;
  campaign_type: string;
  objective: string;
};

type SortKey = "match" | "pay" | "newest";

export function MarketplaceCampaignList({
  campaigns,
  linkPrefix = "/brand-deals/marketplace",
}: {
  campaigns: MarketplaceCampaign[];
  linkPrefix?: string;
}) {
  const [objective, setObjective] = useState("");
  const [minPay, setMinPay] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    let list = [...campaigns];
    if (objective) list = list.filter((c) => c.objective === objective);
    if (minPay) {
      const min = Number(minPay);
      if (!Number.isNaN(min)) list = list.filter((c) => Number(c.per_advocate_compensation) >= min);
    }
    list.sort((a, b) => {
      if (sort === "pay") return Number(b.per_advocate_compensation) - Number(a.per_advocate_compensation);
      if (sort === "newest") return b.application_deadline.localeCompare(a.application_deadline);
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [campaigns, objective, minPay, sort]);

  const selectClass =
    "rounded-brand-sm border border-gold/30 bg-navy-lift px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy";

  if (campaigns.length === 0) {
    return <p className="font-body text-gold-body">No published campaigns. Check back soon.</p>;
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3" role="search" aria-label="Filter campaigns">
        <label className="font-body text-sm text-gold">
          Objective
          <select value={objective} onChange={(e) => setObjective(e.target.value)} className={`ml-2 ${selectClass}`}>
            <option value="">All</option>
            <option value="awareness">Awareness</option>
            <option value="product_launch">Product launch</option>
            <option value="sales">Sales</option>
            <option value="ugc_generation">UGC</option>
          </select>
        </label>
        <label className="font-body text-sm text-gold">
          Min pay ($)
          <input
            type="number"
            min={0}
            value={minPay}
            onChange={(e) => setMinPay(e.target.value)}
            className={`ml-2 w-24 ${selectClass}`}
          />
        </label>
        <label className="font-body text-sm text-gold">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={`ml-2 ${selectClass}`}>
            <option value="newest">Newest deadline</option>
            <option value="pay">Highest pay</option>
            <option value="match">Best match (A–Z)</option>
          </select>
        </label>
      </div>

      <ul className="space-y-4">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              href={`${linkPrefix}/${c.id}`}
              className="block rounded-brand-md border border-gold/15 bg-navy-lift p-5 transition hover:border-gold/40"
            >
              <h2 className="font-heading text-xl text-gold">{c.title}</h2>
              <p className="mt-2 line-clamp-2 font-body text-sm text-cream/80">{c.description}</p>
              <p className="mt-3 font-body text-sm text-gold">
                {formatCurrency(Number(c.per_advocate_compensation))} · Apply by{" "}
                {formatDate(c.application_deadline)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="font-body text-gold-body">No campaigns match your filters.</p>
      )}
    </>
  );
}
