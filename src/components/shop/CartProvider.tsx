"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/shop/types";

type CartContextValue = {
  items: CartLine[];
  guest: boolean;
  loading: boolean;
  itemCount: number;
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity?: number, variantId?: string | null) => Promise<void>;
  updateQuantity: (params: {
    id?: string;
    productId?: string;
    variantId?: string | null;
    quantity: number;
  }) => Promise<void>;
  removeItem: (params: { id?: string; productId?: string; variantId?: string | null }) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [guest, setGuest] = useState(true);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items ?? []);
      setGuest(Boolean(data.guest));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId: string, quantity = 1, variantId?: string | null) => {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity }),
      });
      await refresh();
    },
    [refresh],
  );

  const updateQuantity = useCallback(
    async (params: {
      id?: string;
      productId?: string;
      variantId?: string | null;
      quantity: number;
    }) => {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          product_id: params.productId,
          variant_id: params.variantId,
          quantity: params.quantity,
        }),
      });
      await refresh();
    },
    [refresh],
  );

  const removeItem = useCallback(
    async (params: { id?: string; productId?: string; variantId?: string | null }) => {
      const search = new URLSearchParams();
      if (params.id) search.set("id", params.id);
      if (params.productId) search.set("product_id", params.productId);
      if (params.variantId) search.set("variant_id", params.variantId);
      await fetch(`/api/cart?${search}`, { method: "DELETE" });
      await refresh();
    },
    [refresh],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + (i.quantity ?? 0), 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, guest, loading, itemCount, refresh, addItem, updateQuantity, removeItem }),
    [items, guest, loading, itemCount, refresh, addItem, updateQuantity, removeItem],
  );

  return (
    <CartContext.Provider value={value}>
      <AnimatePresence mode="wait">
        {!reduceMotion && itemCount > 0 ? (
          <motion.span
            key={itemCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="sr-only"
            aria-live="polite"
          >
            Cart updated, {itemCount} items
          </motion.span>
        ) : null}
      </AnimatePresence>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
