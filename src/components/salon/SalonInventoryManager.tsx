"use client";

import { useState } from "react";
import type { SalonInventoryItem } from "@/types/salon";

type Props = {
  salonId: string;
  initialItems: SalonInventoryItem[];
};

export function SalonInventoryManager({ salonId, initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");

  const lowStock = items.filter((i) => i.quantity_on_hand <= i.reorder_point);

  async function addItem() {
    if (!name.trim()) return;
    const res = await fetch(`/api/salons/${salonId}/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: name,
        unit: "count",
        quantity_on_hand: 0,
        reorder_point: 5,
      }),
    });
    const data = await res.json();
    if (data.item) {
      setItems((prev) => [...prev, data.item]);
      setName("");
    }
  }

  async function adjust(id: string, delta: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const res = await fetch(`/api/salons/${salonId}/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity_on_hand: item.quantity_on_hand + delta,
        quantity_delta: delta,
      }),
    });
    const data = await res.json();
    if (data.item) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data.item } : i)));
    }
  }

  return (
    <div className="space-y-6">
      {lowStock.length > 0 ? (
        <div className="rounded-brand-lg border border-amber-500/40 bg-amber-950/20 px-4 py-3">
          <p className="font-body text-sm text-amber-200">
            {lowStock.length} product{lowStock.length === 1 ? "" : "s"} below reorder point
          </p>
          <ul className="mt-2 font-body text-xs text-gold-body">
            {lowStock.map((i) => (
              <li key={i.id}>
                {i.product_name}: {i.quantity_on_hand} {i.unit} left (reorder at {i.reorder_point})
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New product name"
          className="flex-1 rounded-brand-sm border border-gold/30 bg-navy px-3 py-2 font-body text-sm text-cream"
        />
        <button
          type="button"
          onClick={() => void addItem()}
          className="rounded-brand-sm bg-gold px-4 py-2 font-body text-sm text-navy"
        >
          Add
        </button>
      </div>

      <ul className="divide-y divide-gold/10 rounded-brand-lg border border-gold/15">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-body font-medium text-cream">{item.product_name}</p>
              <p className="font-body text-xs text-gold-body">
                {item.quantity_on_hand} {item.unit}
                {item.supplier ? ` · ${item.supplier}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void adjust(item.id, -1)}
                className="rounded border border-gold/20 px-2 py-1 text-gold"
                aria-label="Decrease stock"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => void adjust(item.id, 1)}
                className="rounded border border-gold/20 px-2 py-1 text-gold"
                aria-label="Increase stock"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
