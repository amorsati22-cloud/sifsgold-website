import { SHOP_CART_COOKIE } from "@/lib/shop/constants";
import type { CartLine } from "@/lib/shop/types";

export type GuestCartItem = {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
};

export function parseGuestCart(cookieValue: string | undefined): GuestCartItem[] {
  if (!cookieValue) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue)) as GuestCartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i.product_id && i.quantity > 0);
  } catch {
    return [];
  }
}

export function serializeGuestCart(items: GuestCartItem[]): string {
  return encodeURIComponent(JSON.stringify(items));
}

export function guestCartCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    name: SHOP_CART_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function mergeGuestIntoUserCart(
  guest: GuestCartItem[],
  existing: CartLine[],
): GuestCartItem[] {
  const map = new Map<string, GuestCartItem>();

  for (const item of existing) {
    const key = `${item.product_id}:${item.variant_id ?? ""}`;
    map.set(key, {
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
    });
  }

  for (const item of guest) {
    const key = `${item.product_id}:${item.variant_id ?? ""}`;
    const prev = map.get(key);
    if (prev) {
      map.set(key, { ...prev, quantity: prev.quantity + item.quantity });
    } else {
      map.set(key, item);
    }
  }

  return [...map.values()];
}

export function lineSubtotal(line: CartLine): number {
  const unit =
    line.variant?.price_override ??
    line.product?.price ??
    0;
  return unit * line.quantity;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineSubtotal(line), 0);
}
