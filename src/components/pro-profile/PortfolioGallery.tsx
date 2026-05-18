"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { formatPortfolioCategory } from "@/types/pro-profile";
import type { PortfolioItem } from "@/types/pro-profile";

type PortfolioGalleryProps = {
  username: string;
  items: PortfolioItem[];
  showViewAllLink?: boolean;
  maxItems?: number;
};

export function PortfolioGallery({
  username,
  items,
  showViewAllLink = true,
  maxItems,
}: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showBefore, setShowBefore] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const list =
      activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory);
    return maxItems ? list.slice(0, maxItems) : list;
  }, [activeCategory, items, maxItems]);

  const slides = useMemo(
    () =>
      filtered.map((item) => ({
        src: showBefore && item.before_image_url ? item.before_image_url : item.image_url,
        alt: item.alt_text || item.caption || formatPortfolioCategory(item.category),
        description: item.caption ?? undefined,
      })),
    [filtered, showBefore],
  );

  const hasBeforeAfter = items.some((i) => i.before_image_url);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-gold/10 bg-navy py-12 md:py-14" aria-labelledby="pro-portfolio-heading">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="pro-portfolio-heading" className="font-heading text-2xl text-gold md:text-3xl">
            Portfolio
          </h2>
          {hasBeforeAfter ? (
            <button
              type="button"
              onClick={() => setShowBefore((v) => !v)}
              className="rounded-full border border-gold/30 px-4 py-1.5 font-body text-sm text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:transition-none"
              aria-pressed={showBefore}
            >
              {showBefore ? "Show after" : "Show before"}
            </button>
          ) : null}
        </div>

        <Tabs.Root value={activeCategory} onValueChange={setActiveCategory} className="mt-6">
          <Tabs.List
            className="flex flex-wrap gap-2 border-b border-gold/10 pb-3"
            aria-label="Portfolio categories"
          >
            {categories.map((cat) => (
              <Tabs.Trigger
                key={cat}
                value={cat}
                className="rounded-full px-3 py-1.5 font-body text-sm text-cream/70 transition-colors data-[state=active]:bg-gold/15 data-[state=active]:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:transition-none"
              >
                {cat === "all" ? "All" : formatPortfolioCategory(cat)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        <ul className="mt-6 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filtered.map((item, index) => {
            const src = showBefore && item.before_image_url ? item.before_image_url : item.image_url;
            const thumb = item.thumb_url || src;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-[3/4] w-full overflow-hidden rounded-brand-md border border-gold/10 bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  <Image
                    src={thumb}
                    alt={item.alt_text || item.caption || formatPortfolioCategory(item.category)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {item.featured ? (
                    <span className="absolute left-2 top-2 rounded bg-gold/90 px-1.5 py-0.5 font-body text-[10px] font-semibold text-navy">
                      Featured
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {showViewAllLink && maxItems && items.length > maxItems ? (
          <p className="mt-6 font-body text-sm">
            <Link
              href={`/${username}/portfolio`}
              className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              See all {items.length} photos →
            </Link>
          </p>
        ) : null}

        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={slides}
          controller={{ closeOnBackdropClick: true }}
          carousel={{ finite: slides.length <= 1 }}
          animation={{ fade: 250 }}
          styles={{ container: { backgroundColor: "rgba(4, 16, 30, 0.95)" } }}
        />
      </div>
    </section>
  );
}
