import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RETURN_REASONS } from "@/lib/shop/constants";
import { formatCurrency } from "@/lib/shop/format";
import { createClient } from "@/lib/supabase/server";

const BUYER_NAV = [
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/returns", label: "Returns" },
];

export default async function BuyerReturnsPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: returns } = await supabase
    .from("returns")
    .select("*, orders(order_number)")
    .in(
      "order_id",
      (
        await supabase.from("orders").select("id").eq("buyer_id", user.id)
      ).data?.map((o) => o.id) ?? [],
    )
    .order("requested_at", { ascending: false });

  return (
    <DashboardShell title="Returns" description="Track return requests and refunds." nav={BUYER_NAV}>
      <ul className="space-y-4">
        {(returns ?? []).map((r) => (
          <li key={r.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
            <p className="font-body text-gold">
              Order {(r.orders as { order_number: string })?.order_number}
            </p>
            <p className="mt-1 font-body text-sm capitalize text-cream/80">Status: {r.status}</p>
            <p className="font-body text-sm text-gold-body">
              Reason: {RETURN_REASONS.find((x) => x.value === r.reason)?.label ?? r.reason}
            </p>
            {r.refund_amount != null && (
              <p className="font-body text-sm text-cream">Refund: {formatCurrency(Number(r.refund_amount))}</p>
            )}
            {r.return_shipping_label_url && (
              <a href={r.return_shipping_label_url} className="mt-2 inline-block text-sm text-gold underline">
                Download return label
              </a>
            )}
          </li>
        ))}
      </ul>
      {(returns ?? []).length === 0 && (
        <p className="font-body text-gold-body">No return requests.</p>
      )}
    </DashboardShell>
  );
}
