import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { STOREFRONT_NAV } from "@/lib/dashboard/storefront-nav";
import { formatCurrency } from "@/lib/shop/format";
import { createClient } from "@/lib/supabase/server";

export default async function StorefrontReturnsPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: returns } = await supabase
    .from("returns")
    .select("*, order_items(product_name_snapshot, storefront_id), orders(order_number)")
    .eq("order_items.storefront_id", user?.id ?? "")
    .order("requested_at", { ascending: false });

  return (
    <DashboardShell title="Returns queue" nav={STOREFRONT_NAV}>
      <ul className="space-y-4">
        {(returns ?? []).map((r) => (
          <li key={r.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
            <p className="font-body text-gold">{(r.orders as { order_number: string })?.order_number}</p>
            <p className="text-sm capitalize text-cream/80">Status: {r.status}</p>
            <p className="text-sm text-gold-body">
              {(r.order_items as { product_name_snapshot: string })?.product_name_snapshot}
            </p>
            {r.refund_amount != null && <p>Refund: {formatCurrency(Number(r.refund_amount))}</p>}
            <form action={`/api/orders/${r.order_id}/return`} method="post" className="mt-3 flex gap-2">
              <button type="submit" name="action" value="approve" className="rounded-brand-sm border border-gold px-3 py-1 text-sm text-gold">
                Approve
              </button>
              <button type="submit" name="action" value="refund" className="rounded-brand-sm bg-gold px-3 py-1 text-sm text-navy">
                Process refund
              </button>
            </form>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}
