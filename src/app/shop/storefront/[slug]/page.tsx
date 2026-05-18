import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { fetchProducts } from "@/lib/shop/products";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export default async function StorefrontPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return <p className="px-4 py-16 font-body text-gold-body">Storefront unavailable.</p>;
  }

  const { data: storefront } = await supabase
    .from("storefronts")
    .select("*")
    .eq("store_slug", slug)
    .eq("store_active", true)
    .maybeSingle();

  if (!storefront) {
    return <p className="px-4 py-16 font-body text-cream">Storefront not found.</p>;
  }

  const { products } = await fetchProducts(supabase, { storefrontId: storefront.id, pageSize: 48 });

  return (
    <div className="left-1/2 w-screen -translate-x-1/2 bg-navy">
      {storefront.banner_url && (
        <div className="relative h-48 w-full bg-navy-deep md:h-64">
          <Image src={storefront.banner_url} alt="" fill className="object-cover" priority />
        </div>
      )}
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          {storefront.logo_url && (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gold/30">
              <Image src={storefront.logo_url} alt="" fill className="object-cover" />
            </div>
          )}
          <div>
            <h1 className="font-heading text-3xl text-gold">{storefront.store_name}</h1>
            {storefront.verified && (
              <p className="font-body text-sm text-teal">Verified Gold Partner on Sif&apos;s Gold</p>
            )}
          </div>
          <GoldButton label="Follow storefront" href="/sign-in" variant="outlined" size="sm" className="ml-auto" />
        </div>
        {storefront.description && (
          <p className="mt-4 max-w-2xl font-body text-cream/90">{storefront.description}</p>
        )}
        <h2 className="mt-10 font-heading text-2xl text-gold">Products</h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
        {products.length === 0 && (
          <p className="font-body text-gold-body">No products listed yet.</p>
        )}
        <p className="mt-8">
          <Link href="/shop" className="font-body text-sm text-gold hover:underline">
            ← Back to Beauty Supply Store
          </Link>
        </p>
      </div>
    </div>
  );
}
