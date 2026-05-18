import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { awardLoyaltyForOrder } from "@/lib/loyalty/integrations";
import { notifyOrderPlaced } from "@/lib/notifications/integrations";
import { guestCartCookieOptions } from "@/lib/shop/cart";
import { decrementInventoryOnOrder } from "@/lib/shop/inventory";
import { PLATFORM_FEE_PERCENT } from "@/lib/shop/constants";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ShippingAddress } from "@/lib/shop/types";

export const runtime = "nodejs";

type Body = {
  payment_intent_id: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  shipping_method: string;
  shipping_cost: number;
  buyer_email: string;
  buyer_name: string;
  buyer_notes?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const stripe = getStripe();
  const supabase = await createClient();
  const admin = createAdminClient();

  if (!stripe || !admin) {
    return NextResponse.json({ error: "Checkout unavailable" }, { status: 503 });
  }

  const intent = await stripe.paymentIntents.retrieve(body.payment_intent_id);
  if (intent.status !== "succeeded") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const cartItems = JSON.parse(intent.metadata.cart_json ?? "[]") as {
    product_id: string;
    variant_id?: string | null;
    quantity: number;
  }[];

  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const subtotal = Number(intent.metadata.subtotal ?? 0);
  const shipping = Number(intent.metadata.shipping ?? body.shipping_cost);
  const tax = Number(intent.metadata.tax ?? 0);
  const total = intent.amount / 100;

  const { data: orderNumber } = await admin.rpc("generate_order_number");

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber ?? `SG-${Date.now()}`,
      buyer_id: user?.id ?? null,
      buyer_email: body.buyer_email,
      buyer_name: body.buyer_name,
      shipping_address: body.shipping_address,
      billing_address: body.billing_address ?? body.shipping_address,
      status: "paid",
      subtotal,
      shipping_cost: shipping,
      tax,
      total,
      stripe_payment_intent_id: intent.id,
      stripe_charge_id: typeof intent.latest_charge === "string" ? intent.latest_charge : undefined,
      shipping_method: body.shipping_method,
      buyer_notes: body.buyer_notes,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  const orderItems: {
    order_id: string;
    product_id: string;
    variant_id?: string | null;
    storefront_id: string;
    product_name_snapshot: string;
    variant_name_snapshot?: string;
    sku_snapshot: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[] = [];

  for (const item of cartItems) {
    const { data: product } = await admin.from("products").select("*").eq("id", item.product_id).single();
    if (!product) continue;

    let variantName: string | undefined;
    let unitPrice = Number(product.price);
    if (item.variant_id) {
      const { data: variant } = await admin
        .from("product_variants")
        .select("*")
        .eq("id", item.variant_id)
        .single();
      if (variant) {
        variantName = variant.name ?? undefined;
        if (variant.price_override != null) unitPrice = Number(variant.price_override);
      }
    }

    const lineTotal = unitPrice * item.quantity;
    orderItems.push({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      storefront_id: product.storefront_id,
      product_name_snapshot: product.name,
      variant_name_snapshot: variantName,
      sku_snapshot: product.sku,
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: lineTotal,
    });
  }

  await admin.from("order_items").insert(orderItems);

  await decrementInventoryOnOrder(admin, cartItems, user?.id);

  if (user) {
    await admin.from("cart_items").delete().eq("user_id", user.id);
    await awardLoyaltyForOrder(order.id as string, user.id);
  }

  const storefrontTotals = new Map<string, number>();
  for (const oi of orderItems) {
    storefrontTotals.set(oi.storefront_id, (storefrontTotals.get(oi.storefront_id) ?? 0) + oi.line_total);
  }

  for (const [storefrontId] of storefrontTotals.keys()) {
    await notifyOrderPlaced(admin, {
      buyerUserId: user?.id ?? null,
      sellerUserId: storefrontId,
      orderNumber: order.order_number as string,
      orderId: order.id as string,
    });
  }

  for (const [storefrontId, amount] of storefrontTotals) {
    const { data: storefront } = await admin
      .from("storefronts")
      .select("stripe_connect_account_id, payout_method")
      .eq("id", storefrontId)
      .single();

    if (storefront?.stripe_connect_account_id && storefront.payout_method === "stripe_express") {
      const transferAmount = Math.round(amount * (1 - PLATFORM_FEE_PERCENT) * 100);
      const chargeId = typeof intent.latest_charge === "string" ? intent.latest_charge : undefined;
      if (chargeId && transferAmount > 0) {
        await stripe.transfers.create({
          amount: transferAmount,
          currency: "usd",
          destination: storefront.stripe_connect_account_id,
          source_transaction: chargeId,
        });
      }
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete(guestCartCookieOptions().name);

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifsgold.com";
    await fetch(`${siteUrl}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-email-trigger-token": process.env.EMAIL_TRIGGER_TOKEN ?? "",
      },
      body: JSON.stringify({
        type: "shop_order_confirmation",
        to: body.buyer_email,
        data: {
          orderNumber: order.order_number,
          buyerName: body.buyer_name,
          total: String(total),
        },
      }),
    });
  } catch {
    // Email is best-effort
  }

  return NextResponse.json({ order_id: order.id, order_number: order.order_number });
}
