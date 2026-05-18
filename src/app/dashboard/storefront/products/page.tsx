import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GoldButton } from "@/components/ui/GoldButton";
import { STOREFRONT_NAV } from "@/lib/dashboard/storefront-nav";
import { formatCurrency } from "@/lib/shop/format";
import { createClient } from "@/lib/supabase/server";

export default async function StorefrontProductsPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, price, inventory_count, active, slug")
    .eq("storefront_id", user?.id ?? "")
    .order("updated_at", { ascending: false });

  return (
    <DashboardShell title="Products" nav={STOREFRONT_NAV}>
      <div className="mb-6 flex flex-wrap gap-3">
        <GoldButton label="Add product" href="/dashboard/storefront/products/new" variant="solid" size="sm" />
      </div>
      <div className="overflow-x-auto rounded-brand-md border border-gold/15">
        <table className="w-full font-body text-sm">
          <thead className="bg-navy-lift text-left text-gold">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-t border-gold/10 text-cream">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{formatCurrency(Number(p.price))}</td>
                <td className="p-3">{p.inventory_count}</td>
                <td className="p-3">{p.active ? "Published" : "Draft"}</td>
                <td className="p-3">
                  <Link href={`/shop/product/${p.slug}`} className="text-gold hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
