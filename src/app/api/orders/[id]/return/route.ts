import { NextResponse } from "next/server";
import { RETURN_WINDOW_DAYS } from "@/lib/shop/constants";
import { purchaseReturnLabel } from "@/lib/shop/shipping";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ReturnReason } from "@/lib/shop/types";

export const runtime = "nodejs";

type Body = {
  order_item_id: string;
  reason: ReturnReason;
  reason_details?: string;
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as Body;
  const supabase = await createClient();
  const admin = createAdminClient();
  const stripe = getStripe();

  if (!supabase || !admin) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .eq("buyer_id", user.id)
    .single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const deliveredAt = order.delivered_at ? new Date(order.delivered_at) : null;
  if (deliveredAt) {
    const windowEnd = new Date(deliveredAt);
    windowEnd.setDate(windowEnd.getDate() + RETURN_WINDOW_DAYS);
    if (new Date() > windowEnd) {
      return NextResponse.json({ error: "Return window has expired" }, { status: 400 });
    }
  }

  const { data: orderItem } = await supabase
    .from("order_items")
    .select("*, product:products(weight_oz)")
    .eq("id", body.order_item_id)
    .eq("order_id", params.id)
    .single();

  if (!orderItem) return NextResponse.json({ error: "Order item not found" }, { status: 404 });

  const { data: storefront } = await admin
    .from("storefronts")
    .select("default_shipping_origin_zip")
    .eq("id", orderItem.storefront_id)
    .single();

  const shippingAddress = order.shipping_address as {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    name: string;
  };

  const label = await purchaseReturnLabel({
    fromAddress: {
      name: shippingAddress.name,
      line1: shippingAddress.line1,
      line2: shippingAddress.line2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postal_code: shippingAddress.postal_code,
      country: shippingAddress.country ?? "US",
    },
    toZip: storefront?.default_shipping_origin_zip ?? "90210",
    weightOz: Number((orderItem.product as { weight_oz?: number })?.weight_oz ?? 16),
  });

  const { data: returnRow, error } = await supabase
    .from("returns")
    .insert({
      order_id: params.id,
      order_item_id: body.order_item_id,
      reason: body.reason,
      reason_details: body.reason_details,
      refund_amount: orderItem.line_total,
      return_shipping_label_url: label.labelUrl,
      status: label.labelUrl ? "approved" : "requested",
      approved_at: label.labelUrl ? new Date().toISOString() : null,
    })
    .select("id, status, return_shipping_label_url")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create return" }, { status: 500 });
  }

  return NextResponse.json({ return: returnRow });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as { return_id: string; action: "approve" | "deny" | "refund" };
  const supabase = await createClient();
  const admin = createAdminClient();
  const stripe = getStripe();

  if (!supabase || !admin || !stripe) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: returnRow } = await admin
    .from("returns")
    .select("*, order_items(storefront_id, line_total), orders(stripe_charge_id, status)")
    .eq("id", body.return_id)
    .single();

  if (!returnRow) return NextResponse.json({ error: "Return not found" }, { status: 404 });

  const storefrontId = (returnRow.order_items as { storefront_id: string }).storefront_id;
  if (storefrontId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (body.action === "deny") {
    await admin.from("returns").update({ status: "denied" }).eq("id", body.return_id);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "approve") {
    await admin
      .from("returns")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", body.return_id);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "refund") {
    const chargeId = (returnRow.orders as { stripe_charge_id?: string }).stripe_charge_id;
    const amount = Math.round(Number(returnRow.refund_amount ?? 0) * 100);

    let stripeRefundId: string | undefined;
    if (chargeId && amount > 0) {
      const refund = await stripe.refunds.create({
        charge: chargeId,
        amount,
      });
      stripeRefundId = refund.id;
    }

    await admin
      .from("returns")
      .update({
        status: "refunded",
        refunded_at: new Date().toISOString(),
        stripe_refund_id: stripeRefundId,
      })
      .eq("id", body.return_id);

    await admin.from("orders").update({ status: "partially_refunded" }).eq("id", params.id);

    return NextResponse.json({ ok: true, stripe_refund_id: stripeRefundId });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
