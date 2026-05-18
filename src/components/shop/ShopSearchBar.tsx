"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  defaultValue?: string;
  large?: boolean;
};

export function ShopSearchBar({ defaultValue = "", large = false }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop/search?q=${encodeURIComponent(q)}` : "/shop/search");
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${large ? "max-w-2xl" : ""}`} role="search">
      <label htmlFor="shop-search" className="sr-only">
        Search Beauty Supply Store
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-body" aria-hidden />
        <input
          id="shop-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search color, tools, skincare, nail supplies…"
          className={`w-full rounded-brand-md border border-gold/30 bg-navy-lift py-3 pl-12 pr-4 font-body text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy ${
            large ? "text-lg" : "text-base"
          }`}
        />
      </div>
    </form>
  );
}
