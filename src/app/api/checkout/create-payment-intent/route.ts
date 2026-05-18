import { NextResponse } from "next/server";
import { cartSubtotal } from "@/lib/shop/cart";
import { reserveInventory } from "@/lib/shop/inventory";
import { canPurchaseProOnlyProduct } from "@/lib/shop/license-verification";
import { calculateTax } from "@/lib/shop/tax";
import { centsFromDecimal } from "@/lib/shop/format";
import { PLATFORM_FEE_PERCENT } from "@/lib/shop/constants";
import { getStripe } from "@/lib/stripe";
import type { ShippingAddress } from "@/lib/shop/types";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  cart_items: { product_id: string; variant_id?: string | null; quantity: number }[];
  shipping_address: ShippingAddress;
  shipping_rate_id: string;
  shipping_cost: number;
  buyer_email: string;
  buyer_name: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const supabase = await createClient();
  const stripe = getStripe();

  if (!supabase || !stripe) {
    return NextResponse.json({ error: "Checkout unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("user_type").eq("id", user.id).maybeSingle()
    : { data: null };

  const { data: proProfile } = user
    ? await supabase
        .from("pro_profiles")
        .select("license_verified, specialties")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  let subtotal = 0;
  const metadata: Record<string, string> = {
    buyer_email: body.buyer_email,
    shipping_rate_id: body.shipping_rate_id,
  };

  for (const item of body.cart_items ?? []) {
    const { data: product } = await supabase.from("products").select("*").eq("id", item.product_id).single();
    if (!product) continue;

    const licenseCheck = canPurchaseProOnlyProduct(product, {
      userType: profile?.user_type,
      licenseVerified: proProfile?.license_verified ?? false,
      specialties: proProfile?.specialties,
    });

    if (!licenseCheck.allowed) {
      return NextResponse.json({ error: licenseCheck.reason }, { status: 403 });
    }

    if (user) {
      const reserved = await reserveInventory(supabase, {
        userId: user.id,
        productId: item.product_id,
        variantId: item.variant_id,
        quantity: item.quantity,
      });
      if (!reserved.ok) {
        return NextResponse.json({ error: reserved.error }, { status: 409 });
      }
    }

    let unitPrice = Number(product.price);
    if (item.variant_id) {
      const { data: variant } = await supabase
        .from("product_variants")
        .select("price_override")
        .eq("id", item.variant_id)
        .single();
      if (variant?.price_override != null) unitPrice = Number(variant.price_override);
    }

    subtotal += unitPrice * item.quantity;
  }

  const shipping = body.shipping_cost ?? 0;
  const { tax } = await calculateTax({
    subtotal,
    shipping,
    address: body.shipping_address,
    lineItems: body.cart_items.map((_, i) => ({ amount: 0, reference: `line_${i}` })),
  });

  const total = subtotal + shipping + tax;
  const applicationFee = Math.round(total * PLATFORM_FEE_PERCENT * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: centsFromDecimal(total),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    receipt_email: body.buyer_email,
    metadata: {
      ...metadata,
      buyer_name: body.buyer_name,
      subtotal: String(subtotal),
      shipping: String(shipping),
      tax: String(tax),
      cart_json: JSON.stringify(body.cart_items),
    },
    application_fee_amount: applicationFee > 0 ? applicationFee : undefined,
  });

  return NextResponse.json({
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
    total,
    subtotal,
    shipping,
    tax,
  });
}
