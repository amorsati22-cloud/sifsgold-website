import { NextResponse } from "next/server";
import { cartSubtotal } from "@/lib/shop/cart";
import { getShippingRates } from "@/lib/shop/shipping";
import { calculateTax } from "@/lib/shop/tax";
import type { CartLine, ShippingAddress } from "@/lib/shop/types";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  cart_items: { product_id: string; variant_id?: string | null; quantity: number }[];
  shipping_address: ShippingAddress;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const supabase = await createClient();

  if (!body.shipping_address?.postal_code) {
    return NextResponse.json({ error: "Shipping address required" }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Store unavailable" }, { status: 503 });
  }

  const lines: CartLine[] = [];

  for (const item of body.cart_items ?? []) {
    const { data: product } = await supabase
      .from("products")
      .select("*, storefront:storefronts(default_shipping_origin_zip)")
      .eq("id", item.product_id)
      .single();

    let variant = null;
    if (item.variant_id) {
      const { data } = await supabase.from("product_variants").select("*").eq("id", item.variant_id).single();
      variant = data;
    }

    if (product) {
      lines.push({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        product: product as CartLine["product"],
        variant: variant as CartLine["variant"],
      });
    }
  }

  const subtotal = cartSubtotal(lines);
  const originZip =
    (lines[0]?.product as { storefront?: { default_shipping_origin_zip?: string } })?.storefront
      ?.default_shipping_origin_zip ?? "90210";

  const parcels = lines.map((l) => ({
    weightOz: Number(l.product?.weight_oz ?? 16) * l.quantity,
  }));

  const shippingOptions = await getShippingRates({
    fromZip: originZip,
    toAddress: body.shipping_address,
    parcels,
  });

  const shipping = shippingOptions[0]?.rate ?? 0;

  const { tax } = await calculateTax({
    subtotal,
    shipping,
    address: body.shipping_address,
    lineItems: lines.map((l, i) => ({
      amount: (l.variant?.price_override ?? l.product?.price ?? 0) * l.quantity,
      reference: `line_${i}`,
    })),
  });

  return NextResponse.json({
    subtotal,
    shipping_options: shippingOptions,
    tax,
    total: subtotal + shipping + tax,
  });
}
