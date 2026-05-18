import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OrderStatusTracker } from "@/components/shop/OrderStatusTracker";
import { GoldButton } from "@/components/ui/GoldButton";
import { RETURN_WINDOW_DAYS } from "@/lib/shop/constants";
import { formatCurrency } from "@/lib/shop/format";
import type { OrderStatus } from "@/lib/shop/types";
import { createClient } from "@/lib/supabase/server";

const BUYER_NAV = [
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/returns", label: "Returns" },
];

type Props = { params: Promise<{ order_id: string }> };

export default async function BuyerOrderDetailPage({ params }: Props) {
  const { order_id } = await params;
  const supabase = await createClient();

  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", order_id)
    .eq("buyer_id", user?.id ?? "")
    .maybeSingle();

  if (!order) {
    return <p className="px-4 py-16 font-body text-cream">Order not found.</p>;
  }

  const canReturn =
    order.status === "delivered" &&
    order.delivered_at &&
    Date.now() - new Date(order.delivered_at).getTime() < RETURN_WINDOW_DAYS * 86400000;

  return (
    <DashboardShell title={`Order ${order.order_number}`} nav={BUYER_NAV}>
      <OrderStatusTracker status={order.status as OrderStatus} />
      <div className="mt-8 space-y-4">
        {(order.order_items as { id: string; product_name_snapshot: string; line_total: number; quantity: number }[]).map(
          (item) => (
            <div key={item.id} className="flex justify-between rounded-brand-md border border-gold/15 bg-navy-lift p-4 font-body text-sm text-cream">
              <span>
                {item.product_name_snapshot} × {item.quantity}
              </span>
              <span>{formatCurrency(Number(item.line_total))}</span>
            </div>
          ),
        )}
      </div>
      {order.tracking_url && (
        <p className="mt-4">
          <Link href={order.tracking_url} className="text-gold underline">
            Track package ({order.carrier})
          </Link>
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <GoldButton label="Reorder" href="/shop/cart" variant="outlined" />
        {canReturn && (
          <GoldButton label="Request return" href={`/dashboard/returns?order=${order_id}`} variant="solid" />
        )}
        {order.status === "delivered" && (
          <GoldButton label="Leave a review" href={`/shop/product`} variant="ghost" />
        )}
      </div>
    </DashboardShell>
  );
}
