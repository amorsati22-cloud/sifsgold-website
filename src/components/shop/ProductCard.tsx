"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, ShoppingBag } from "lucide-react";
import { StarRating } from "@/components/shop/StarRating";
import { formatCurrency } from "@/lib/shop/format";
import type { ProductRow } from "@/lib/shop/types";

type Props = {
  product: ProductRow;
  showProBadge?: boolean;
};

export function ProductCard({ product, showProBadge = true }: Props) {
  const primaryImage = product.images?.find((i) => i.primary) ?? product.images?.[0];
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;

  return (
    <article className="group flex flex-col overflow-hidden rounded-brand-md border border-gold/15 bg-navy-lift transition hover:border-gold/40 motion-reduce:transition-none">
      <Link href={`/shop/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-navy-deep">
        {primaryImage?.url ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            fill
            className="object-cover transition duration-brand-medium group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-deep text-gold/40">
            <ShoppingBag className="h-12 w-12" aria-hidden />
          </div>
        )}
        {product.pro_only && showProBadge && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-brand-sm bg-navy/90 px-2 py-1 font-body text-xs text-gold">
            <Lock className="h-3 w-3" aria-hidden />
            Pro only
          </span>
        )}
        {product.new_arrival && (
          <span className="absolute right-2 top-2 rounded-brand-sm bg-teal/90 px-2 py-1 font-body text-xs font-semibold text-navy">
            New
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <p className="font-body text-xs uppercase tracking-wide text-gold-body">{product.brand}</p>
        )}
        <Link href={`/shop/product/${product.slug}`}>
          <h3 className="font-heading line-clamp-2 text-lg text-cream hover:text-gold">{product.name}</h3>
        </Link>
        {product.average_rating != null && product.total_reviews > 0 && (
          <StarRating rating={Number(product.average_rating)} showValue />
        )}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-body text-lg font-semibold text-gold">{formatCurrency(Number(product.price))}</span>
          {onSale && (
            <span className="font-body text-sm text-cream/50 line-through">
              {formatCurrency(Number(product.compare_at_price))}
            </span>
          )}
        </div>
        {product.storefront && (
          <Link
            href={`/shop/storefront/${product.storefront.store_slug}`}
            className="font-body text-xs text-gold-body hover:text-gold"
          >
            Sold by {product.storefront.store_name}
          </Link>
        )}
      </div>
    </article>
  );
}
