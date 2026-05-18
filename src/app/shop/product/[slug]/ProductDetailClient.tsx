"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/shop/CartProvider";
import { ProOnlyGate } from "@/components/shop/ProOnlyGate";
import { GoldButton } from "@/components/ui/GoldButton";
import { formatCurrency } from "@/lib/shop/format";
import type { ProductRow, ProductVariantRow } from "@/lib/shop/types";

type Props = {
  product: ProductRow;
  variants: ProductVariantRow[];
  canPurchase: boolean;
  blockReason?: string;
};

export function ProductDetailClient({ product, variants, canPurchase, blockReason }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  const selected = variants.find((v) => v.id === variantId);
  const price = selected?.price_override ?? product.price;
  const inStock =
    !product.track_inventory ||
    product.backorder_allowed ||
    (selected ? selected.inventory_count > 0 : product.inventory_count > 0);

  async function handleAdd(redirectCheckout = false) {
    if (!canPurchase) return;
    setBusy(true);
    try {
      await addItem(product.id, qty, variantId);
      if (redirectCheckout) router.push("/shop/checkout");
    } finally {
      setBusy(false);
    }
  }

  if (!canPurchase) {
    return <ProOnlyGate reason={blockReason} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="font-heading text-3xl text-gold">{formatCurrency(Number(price))}</span>
        {product.compare_at_price != null && product.compare_at_price > Number(price) && (
          <span className="font-body text-lg text-cream/50 line-through">
            {formatCurrency(Number(product.compare_at_price))}
          </span>
        )}
      </div>
      <p className={`font-body text-sm ${inStock ? "text-teal" : "text-red-400"}`}>
        {inStock ? "In stock" : "Out of stock"}
      </p>

      {variants.length > 0 && (
        <fieldset>
          <legend className="mb-2 font-body text-sm font-medium text-gold">Select option</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-brand-sm border px-3 py-2 font-body text-sm focus:ring-2 focus:ring-gold ${
                  variantId === v.id ? "border-gold bg-gold/15 text-gold" : "border-gold/30 text-cream"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="font-body text-sm text-gold">
          Qty
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          className="w-20 rounded-brand-sm border border-gold/30 bg-navy-lift px-2 py-1 font-body text-cream focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <GoldButton
          label={busy ? "Adding…" : "Add to cart"}
          onClick={() => handleAdd(false)}
          variant="solid"
          size="lg"
        />
        <GoldButton label="Quick buy" onClick={() => handleAdd(true)} variant="outlined" size="lg" />
        <GoldButton label="Add to wishlist" href="/dashboard/wishlist" variant="ghost" size="md" />
      </div>
    </div>
  );
}
