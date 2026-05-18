import Link from "next/link";
import { GoldButton } from "@/components/ui/GoldButton";
import { formatCurrency } from "@/lib/shop/format";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ order_id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { order_id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return <p className="px-4 py-16 font-body text-gold-body">Order details unavailable.</p>;
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", order_id)
    .maybeSingle();

  if (!order) {
    return <p className="px-4 py-16 font-body text-cream">Order not found.</p>;
  }

  const estimatedDelivery = order.shipped_at
    ? "Shipped — track your package below"
    : "Estimated delivery in 5–7 business days after processing";

  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-body text-sm uppercase tracking-widest text-teal">Order confirmed</p>
      <h1 className="mt-2 font-heading text-4xl text-gold">Thank you, {order.buyer_name}</h1>
      <p className="mt-2 font-body text-cream/90">
        Order <strong className="text-gold">{order.order_number}</strong> is confirmed. A receipt was sent to{" "}
        {order.buyer_email}.
      </p>

      <div className="mt-8 rounded-brand-md border border-gold/20 bg-navy-lift p-6">
        <h2 className="font-heading text-xl text-gold">Order summary</h2>
        <ul className="mt-4 space-y-2">
          {(order.order_items as { product_name_snapshot: string; quantity: number; line_total: number }[]).map(
            (item, i) => (
              <li key={i} className="flex justify-between font-body text-sm text-cream">
                <span>
                  {item.product_name_snapshot} × {item.quantity}
                </span>
                <span>{formatCurrency(Number(item.line_total))}</span>
              </li>
            ),
          )}
        </ul>
        <p className="mt-4 border-t border-gold/20 pt-4 font-body text-gold">
          Total: {formatCurrency(Number(order.total))}
        </p>
      </div>

      <p className="mt-6 font-body text-sm text-gold-body">{estimatedDelivery}</p>
      {order.tracking_url && (
        <p className="mt-2">
          <Link href={order.tracking_url} className="font-body text-gold underline">
            Track shipment
          </Link>
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <GoldButton label="View order" href={`/dashboard/orders/${order_id}`} variant="solid" />
        <GoldButton label="Continue shopping" href="/shop" variant="outlined" />
      </div>
    </div>
  );
}
