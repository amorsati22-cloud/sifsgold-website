"use client";

import { SORT_OPTIONS, type SortValue } from "@/lib/shop/constants";

export type FilterState = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  minRating?: string;
  inStockOnly?: boolean;
  proOnly?: boolean;
  sort: SortValue;
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories?: { id: string; label: string }[];
};

export function ShopFilters({ filters, onChange, categories = [] }: Props) {
  return (
    <aside className="space-y-6 rounded-brand-md border border-gold/15 bg-navy-lift p-4" aria-label="Product filters">
      <div>
        <label htmlFor="sort" className="mb-2 block font-body text-sm font-medium text-gold">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as SortValue })}
          className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {categories.length > 0 && (
        <div>
          <p className="mb-2 font-body text-sm font-medium text-gold">Category</p>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => onChange({ ...filters, category: undefined })}
                className={`font-body text-sm ${!filters.category ? "text-gold" : "text-cream/70 hover:text-gold"}`}
              >
                All categories
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, category: cat.id })}
                  className={`font-body text-sm ${
                    filters.category === cat.id ? "text-gold" : "text-cream/70 hover:text-gold"
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 font-body text-sm font-medium text-gold">Price range</p>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full rounded-brand-sm border border-gold/30 bg-navy px-2 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
            aria-label="Minimum price"
          />
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full rounded-brand-sm border border-gold/30 bg-navy px-2 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div>
        <label htmlFor="brand-filter" className="mb-2 block font-body text-sm font-medium text-gold">
          Brand
        </label>
        <input
          id="brand-filter"
          type="text"
          value={filters.brand ?? ""}
          onChange={(e) => onChange({ ...filters, brand: e.target.value })}
          className="w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream focus:ring-2 focus:ring-gold"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="font-body text-sm font-medium text-gold">Availability</legend>
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input
            type="checkbox"
            checked={filters.inStockOnly ?? false}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded border-gold/40 text-gold focus:ring-gold"
          />
          In stock only
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-cream">
          <input
            type="checkbox"
            checked={filters.proOnly ?? false}
            onChange={(e) => onChange({ ...filters, proOnly: e.target.checked })}
            className="rounded border-gold/40 text-gold focus:ring-gold"
          />
          Pro-only products
        </label>
      </fieldset>
    </aside>
  );
}
