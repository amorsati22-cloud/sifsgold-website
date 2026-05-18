"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import { GoldButton } from "@/components/ui/GoldButton";
import { cartSubtotal, lineSubtotal } from "@/lib/shop/cart";
import { formatCurrency } from "@/lib/shop/format";

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem } = useCart();
  const reduceMotion = useReducedMotion();
  const subtotal = cartSubtotal(items);

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl text-gold">Your cart</h1>

      {loading && <p className="mt-4 font-body text-gold-body">Loading cart…</p>}

      {!loading && items.length === 0 && (
        <div className="mt-8 space-y-4">
          <p className="font-body text-cream/80">Your cart is empty.</p>
          <GoldButton label="Continue shopping" href="/shop" variant="solid" />
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {items.map((line) => {
            const product = line.product;
            const img = product?.images?.[0];
            const content = (
              <li
                key={line.id ?? `${line.product_id}-${line.variant_id}`}
                className="flex gap-4 rounded-brand-md border border-gold/15 bg-navy-lift p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-brand-sm bg-navy-deep">
                  {img?.url && (
                    <Image src={img.url} alt="" fill className="object-cover" sizes="96px" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link href={`/shop/product/${product?.slug}`} className="font-heading text-lg text-cream hover:text-gold">
                    {product?.name ?? "Product"}
                  </Link>
                  {line.variant?.name && (
                    <p className="font-body text-sm text-gold-body">{line.variant.name}</p>
                  )}
                  <p className="mt-auto font-body text-gold">{formatCurrency(lineSubtotal(line))}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        updateQuantity({
                          id: line.id,
                          productId: line.product_id,
                          variantId: line.variant_id,
                          quantity: Math.max(1, line.quantity - 1),
                        })
                      }
                      className="rounded-brand-sm p-1 text-gold hover:bg-white/5 focus:ring-2 focus:ring-gold"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-body text-cream">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        updateQuantity({
                          id: line.id,
                          productId: line.product_id,
                          variantId: line.variant_id,
                          quantity: line.quantity + 1,
                        })
                      }
                      className="rounded-brand-sm p-1 text-gold hover:bg-white/5 focus:ring-2 focus:ring-gold"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() =>
                        removeItem({
                          id: line.id,
                          productId: line.product_id,
                          variantId: line.variant_id,
                        })
                      }
                      className="ml-auto rounded-brand-sm p-1 text-cream/60 hover:text-red-400 focus:ring-2 focus:ring-gold"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mt-2 self-start font-body text-xs text-gold-body underline hover:text-gold"
                  >
                    Save for later
                  </button>
                </div>
              </li>
            );

            return reduceMotion ? (
              content
            ) : (
              <motion.div key={line.id ?? line.product_id} layout>
                {content}
              </motion.div>
            );
          })}
        </ul>

        <aside className="h-fit rounded-brand-md border border-gold/20 bg-navy-lift p-6">
          <h2 className="font-heading text-xl text-gold">Order summary</h2>
          <dl className="mt-4 space-y-2 font-body text-sm">
            <div className="flex justify-between text-cream">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-cream/70">
              <dt>Shipping</dt>
              <dd>Calculated at checkout</dd>
            </div>
            <div className="flex justify-between text-cream/70">
              <dt>Tax</dt>
              <dd>Estimated at checkout</dd>
            </div>
          </dl>
          <label className="mt-4 block">
            <span className="font-body text-sm text-gold">Promo code</span>
            <input
              type="text"
              className="mt-1 w-full rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-cream focus:ring-2 focus:ring-gold"
              placeholder="Enter code"
            />
          </label>
          <div className="mt-6 space-y-3">
            <GoldButton label="Checkout" href="/shop/checkout" variant="solid" size="lg" />
            <GoldButton label="Continue shopping" href="/shop" variant="outlined" size="md" />
          </div>
        </aside>
      </div>
    </div>
  );
}
