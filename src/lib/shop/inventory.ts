import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { RESERVATION_MINUTES } from "@/lib/shop/constants";

export async function releaseExpiredReservations(supabase: SupabaseClient): Promise<void> {
  await supabase
    .from("inventory_reservations")
    .delete()
    .lt("expires_at", new Date().toISOString());
}

export async function reserveInventory(
  supabase: SupabaseClient,
  params: {
    userId: string;
    productId: string;
    variantId?: string | null;
    quantity: number;
  },
): Promise<{ ok: boolean; error?: string }> {
  await releaseExpiredReservations(supabase);

  const { data: product } = await supabase
    .from("products")
    .select("id, track_inventory, inventory_count, backorder_allowed")
    .eq("id", params.productId)
    .single();

  if (!product) return { ok: false, error: "Product not found" };
  if (!product.track_inventory) return { ok: true };

  let available = product.inventory_count ?? 0;

  if (params.variantId) {
    const { data: variant } = await supabase
      .from("product_variants")
      .select("inventory_count")
      .eq("id", params.variantId)
      .single();
    if (variant) available = variant.inventory_count ?? 0;
  }

  const { data: held } = await supabase
    .from("inventory_reservations")
    .select("quantity")
    .eq("product_id", params.productId)
    .eq("variant_id", params.variantId ?? null)
    .gt("expires_at", new Date().toISOString());

  const heldQty = (held ?? []).reduce((sum, r) => sum + (r.quantity ?? 0), 0);
  const remaining = available - heldQty;

  if (remaining < params.quantity && !product.backorder_allowed) {
    return { ok: false, error: "Insufficient inventory" };
  }

  const expiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000).toISOString();

  await supabase.from("inventory_reservations").delete().eq("user_id", params.userId).eq("product_id", params.productId).eq("variant_id", params.variantId ?? null);

  await supabase.from("inventory_reservations").insert({
    user_id: params.userId,
    product_id: params.productId,
    variant_id: params.variantId ?? null,
    quantity: params.quantity,
    expires_at: expiresAt,
  });

  return { ok: true };
}

export async function decrementInventoryOnOrder(
  supabase: SupabaseClient,
  items: { product_id: string; variant_id?: string | null; quantity: number }[],
  userId?: string,
): Promise<void> {
  for (const item of items) {
    if (item.variant_id) {
      const { data: variant } = await supabase
        .from("product_variants")
        .select("inventory_count")
        .eq("id", item.variant_id)
        .single();

      if (variant) {
        await supabase
          .from("product_variants")
          .update({ inventory_count: Math.max(0, (variant.inventory_count ?? 0) - item.quantity) })
          .eq("id", item.variant_id);
      }
    }

    const { data: product } = await supabase
      .from("products")
      .select("track_inventory, inventory_count")
      .eq("id", item.product_id)
      .single();

    if (product?.track_inventory) {
      await supabase
        .from("products")
        .update({
          inventory_count: Math.max(0, (product.inventory_count ?? 0) - item.quantity),
        })
        .eq("id", item.product_id);
    }
  }

  if (userId) {
    await supabase.from("inventory_reservations").delete().eq("user_id", userId);
  }
}
