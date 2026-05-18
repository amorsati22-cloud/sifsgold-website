import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProductCard } from "@/components/shop/ProductCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { createClient } from "@/lib/supabase/server";

const BUYER_NAV = [
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/returns", label: "Returns" },
];

export default async function WishlistPage() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <p className="px-4 py-16">Please sign in.</p>;

  const { data: items } = await supabase
    .from("wishlist")
    .select("product:products(*, storefront:storefronts(store_name, store_slug, verified))")
    .eq("user_id", user.id);

  const products = (items ?? []).map((i) => i.product).filter(Boolean);

  return (
    <DashboardShell title="Wishlist" description="Saved products from the Beauty Supply Store." nav={BUYER_NAV}>
      <GoldButton label="Move all to cart" href="/shop/cart" variant="solid" size="sm" className="mb-6" />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {products.map((p) => (
          <li key={(p as unknown as { id: string }).id}>
            <ProductCard product={p as unknown as Parameters<typeof ProductCard>[0]["product"]} />
          </li>
        ))}
      </ul>
      {products.length === 0 && <p className="font-body text-gold-body">Your wishlist is empty.</p>}
    </DashboardShell>
  );
}
