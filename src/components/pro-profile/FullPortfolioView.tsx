"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Search } from "lucide-react";
import { formatPortfolioCategory } from "@/types/pro-profile";
import type { PortfolioItem, ProProfile } from "@/types/pro-profile";

type FullPortfolioViewProps = {
  profile: ProProfile;
  items: PortfolioItem[];
};

export function FullPortfolioView({ profile, items }: FullPortfolioViewProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [showBefore, setShowBefore] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      const haystack = [
        item.caption,
        item.alt_text,
        item.category,
        ...(item.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [category, items, query]);

  const slides = useMemo(
    () =>
      filtered.map((item) => ({
        src: showBefore && item.before_image_url ? item.before_image_url : item.image_url,
        alt: item.alt_text || item.caption || formatPortfolioCategory(item.category),
        description: item.caption ?? undefined,
      })),
    [filtered, showBefore],
  );

  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col sm:-mx-6 md:-mx-8">
      <a href="#portfolio-main" className="skip-link">
        Skip to portfolio
      </a>
      <div className="border-b border-gold/10 bg-navy-deep/60 py-8">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
          <nav aria-label="Breadcrumb" className="font-body text-sm text-gold-body">
            <Link href={`/${profile.username}`} className="hover:text-gold">
              {profile.display_name}
            </Link>
            <span className="mx-2 text-cream/40">/</span>
            <span className="text-cream">Portfolio</span>
          </nav>
          <h1 className="mt-3 font-heading text-3xl text-gold">Portfolio</h1>
          <p className="mt-2 font-body text-sm text-cream/75">
            {items.length} photo{items.length === 1 ? "" : "s"} · filter by category or search captions and tags
          </p>
        </div>
      </div>

      <div id="portfolio-main" className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="relative flex-1 sm:max-w-xs">
            <span className="sr-only">Search portfolio</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-brand-md border border-gold/20 bg-navy-deep py-2 pl-10 pr-3 font-body text-sm text-cream placeholder:text-cream/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="rounded-brand-md border border-gold/20 bg-navy-deep px-3 py-2 font-body text-sm text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All categories" : formatPortfolioCategory(cat)}
              </option>
            ))}
          </select>
          {items.some((i) => i.before_image_url) ? (
            <button
              type="button"
              onClick={() => setShowBefore((v) => !v)}
              className="rounded-full border border-gold/30 px-4 py-2 font-body text-sm text-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-pressed={showBefore}
            >
              {showBefore ? "Show after" : "Before / after"}
            </button>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 font-body text-cream/70">No photos match your filters.</p>
        ) : (
          <ul className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {filtered.map((item, index) => {
              const src = showBefore && item.before_image_url ? item.before_image_url : item.image_url;
              const thumb = item.thumb_url || src;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-brand-md border border-gold/10 bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Image
                      src={thumb}
                      alt={item.alt_text || item.caption || formatPortfolioCategory(item.category)}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={slides}
          controller={{ closeOnBackdropClick: true }}
          styles={{ container: { backgroundColor: "rgba(4, 16, 30, 0.95)" } }}
        />
      </div>
    </div>
  );
}
