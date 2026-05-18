import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { STOREFRONT_NAV } from "@/lib/dashboard/storefront-nav";
import { formatCurrency } from "@/lib/shop/format";
import { createClient } from "@/lib/supabase/server";

export default async function StorefrontOrdersPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: items } = await supabase
    .from("order_items")
    .select("*, orders(id, order_number, status, created_at, buyer_name)")
    .eq("storefront_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <DashboardShell title="Orders queue" nav={STOREFRONT_NAV}>
      <ul className="space-y-3">
        {(items ?? []).map((item) => {
          const order = item.orders as { id: string; order_number: string; status: string; buyer_name: string };
          return (
            <li key={item.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-body text-gold">{order?.order_number}</span>
                <span className="font-body text-sm capitalize text-cream/70">{order?.status}</span>
              </div>
              <p className="mt-1 font-body text-sm text-cream">
                {item.product_name_snapshot} × {item.quantity} — {formatCurrency(Number(item.line_total))}
              </p>
              <p className="font-body text-xs text-gold-body">Buyer: {order?.buyer_name}</p>
            </li>
          );
        })}
      </ul>
    </DashboardShell>
  );
}
