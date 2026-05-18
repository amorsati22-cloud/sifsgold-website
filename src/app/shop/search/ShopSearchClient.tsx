"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters, type FilterState } from "@/components/shop/ShopFilters";
import { ShopSearchBar } from "@/components/shop/ShopSearchBar";
import type { ProductRow } from "@/lib/shop/types";

type Props = {
  categories: { id: string; label: string }[];
  initialProducts: ProductRow[];
  initialTotal: number;
  initialQuery: string;
};

export function ShopSearchClient({
  categories,
  initialProducts,
  initialTotal,
  initialQuery,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    sort: (searchParams.get("sort") as FilterState["sort"]) || "relevance",
    category: searchParams.get("category") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    inStockOnly: searchParams.get("inStock") === "1",
    proOnly: searchParams.get("proOnly") === "1",
  });
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);

  const syncUrl = useCallback(
    (next: FilterState, q: string, p: number) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (next.category) params.set("category", next.category);
      if (next.brand) params.set("brand", next.brand);
      if (next.minPrice) params.set("minPrice", next.minPrice);
      if (next.maxPrice) params.set("maxPrice", next.maxPrice);
      if (next.inStockOnly) params.set("inStock", "1");
      if (next.proOnly) params.set("proOnly", "1");
      if (next.sort !== "relevance") params.set("sort", next.sort);
      if (p > 1) params.set("page", String(p));
      router.replace(`/shop/search?${params}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    syncUrl(filters, initialQuery, page);
  }, [filters, initialQuery, page, syncUrl]);

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl text-gold">Search results</h1>
      <div className="mt-6">
        <ShopSearchBar defaultValue={initialQuery} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <ShopFilters filters={filters} onChange={setFilters} categories={categories} />
        <div>
          <p className="mb-4 font-body text-sm text-gold-body">{total} products</p>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          {products.length === 0 && (
            <p className="font-body text-cream/70">No products match your filters. Try adjusting your search.</p>
          )}
          {total > products.length && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="mt-8 rounded-brand-md border border-gold px-6 py-2 font-body text-gold hover:bg-gold/10 focus:ring-2 focus:ring-gold"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
