import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { STOREFRONT_NAV } from "@/lib/dashboard/storefront-nav";
import { formatCurrency } from "@/lib/shop/format";
import { createClient } from "@/lib/supabase/server";

export default async function StorefrontDashboardPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: storefront } = await supabase.from("storefronts").select("*").eq("id", user.id).maybeSingle();

  const { data: allProducts } = await supabase
    .from("products")
    .select("name, inventory_count, inventory_low_threshold")
    .eq("storefront_id", user.id)
    .eq("track_inventory", true);

  const lowStock = (allProducts ?? []).filter(
    (p) => (p.inventory_count ?? 0) <= (p.inventory_low_threshold ?? 5),
  );

  const { data: recentItems } = await supabase
    .from("order_items")
    .select("*, orders(created_at, status, order_number)")
    .eq("storefront_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const revenue =
    (
      await supabase
        .from("order_items")
        .select("line_total")
        .eq("storefront_id", user.id)
    ).data?.reduce((s, i) => s + Number(i.line_total), 0) ?? 0;

  return (
    <DashboardShell
      title={storefront?.store_name ?? "Gold Partner Storefront"}
      description="Manage your Beauty Supply Store on Sif's Gold — inventory, orders, and payouts."
      nav={STOREFRONT_NAV}
    >
      {!storefront && (
        <p className="mb-6 font-body text-gold-body">
          Complete storefront setup to start selling to The Gold Collective.
        </p>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Revenue" value={formatCurrency(revenue)} />
        <KpiCard label="Recent orders" value={String(recentItems?.length ?? 0)} />
        <KpiCard label="Low stock alerts" value={String(lowStock?.length ?? 0)} />
      </div>

      <GoldButton label="Add product" href="/dashboard/storefront/products/new" variant="solid" size="sm" />

      <h2 className="mt-10 font-heading text-xl text-gold">Recent orders</h2>
      <ul className="mt-4 space-y-2">
        {(recentItems ?? []).map((item) => (
          <li key={item.id} className="rounded-brand-sm border border-gold/15 bg-navy-lift px-4 py-3 font-body text-sm text-cream">
            {(item.orders as { order_number: string })?.order_number} — {item.product_name_snapshot} —{" "}
            {formatCurrency(Number(item.line_total))}
          </li>
        ))}
      </ul>

      {lowStock && lowStock.length > 0 && (
        <>
          <h2 className="mt-10 font-heading text-xl text-gold">Low inventory</h2>
          <ul className="mt-4 space-y-2">
            {lowStock.map((p) => (
              <li key={p.name} className="font-body text-sm text-gold-body">
                {p.name}: {p.inventory_count} left (threshold {p.inventory_low_threshold})
              </li>
            ))}
          </ul>
        </>
      )}

      {storefront?.store_slug && (
        <p className="mt-8">
          <Link href={`/shop/storefront/${storefront.store_slug}`} className="text-gold underline">
            View public storefront
          </Link>
        </p>
      )}
    </DashboardShell>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-md border border-gold/20 bg-navy-lift p-4">
      <p className="font-body text-xs uppercase text-gold-body">{label}</p>
      <p className="mt-1 font-heading text-2xl text-gold">{value}</p>
    </div>
  );
}
