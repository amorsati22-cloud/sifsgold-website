import Link from "next/link";
import { ChevronRight, Store } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopSearchBar } from "@/components/shop/ShopSearchBar";
import { GoldButton } from "@/components/ui/GoldButton";
import { fetchProducts } from "@/lib/shop/products";
import { createClient } from "@/lib/supabase/server";

export default async function ShopHomePage() {
  const supabase = await createClient();

  const categories = supabase
    ? (await supabase.from("product_categories").select("id, label").order("display_order")).data ?? []
    : [];

  const empty = { products: [], total: 0 };
  const featured = supabase ? await fetchProducts(supabase, { featured: true, pageSize: 8 }) : empty;
  const proPicks = supabase
    ? await fetchProducts(supabase, { sort: "rating", minRating: 4, pageSize: 8 })
    : empty;
  const newArrivals = supabase ? await fetchProducts(supabase, { newArrival: true, pageSize: 8 }) : empty;
  const bestsellers = supabase ? await fetchProducts(supabase, { bestseller: true, pageSize: 8 }) : empty;

  const storefronts = supabase
    ? (await supabase.from("storefronts").select("store_name, store_slug, logo_url").eq("store_active", true).limit(12))
        .data ?? []
    : [];

  return (
    <div className="left-1/2 w-screen -translate-x-1/2 bg-navy">
      <section className="border-b border-gold/20 bg-gradient-to-b from-navy-lift to-navy px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-content">
          <p className="font-body text-sm uppercase tracking-widest text-gold-body">The Gold Collective</p>
          <h1 className="mt-2 font-heading text-4xl text-gold md:text-5xl">Beauty Supply Store</h1>
          <p className="mt-4 max-w-2xl font-body text-lg text-cream/90">
            Curated professional and retail beauty supply from verified Gold Partners. Licensed pros in Sif&apos;s
            Advocates unlock pro-only formulas — clients shop retail-safe favorites.
          </p>
          <div className="mt-8">
            <ShopSearchBar large />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl text-gold">Shop by category</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/shop/category/${cat.id}`}
                className="flex items-center justify-between rounded-brand-md border border-gold/20 bg-navy-lift px-4 py-3 font-body text-cream transition hover:border-gold/50 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {cat.label}
                <ChevronRight className="h-4 w-4 text-gold-body" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        {categories.length === 0 && (
          <p className="font-body text-gold-body">Categories will appear once the store is connected to Supabase.</p>
        )}
      </section>

      {featured.products.length > 0 && (
        <ProductSection title="Featured" products={featured.products} href="/shop/search?featured=1" />
      )}
      {proPicks.products.length > 0 && (
        <ProductSection title="Pro Picks" subtitle="Top-rated by licensed pros" products={proPicks.products} />
      )}
      {newArrivals.products.length > 0 && (
        <ProductSection title="New Arrivals" products={newArrivals.products} href="/shop/search?new=1" />
      )}
      {bestsellers.products.length > 0 && (
        <ProductSection title="Bestsellers" products={bestsellers.products} href="/shop/search?bestseller=1" />
      )}

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-2xl text-gold">Browse by storefront</h2>
          <Link href="/shop/search" className="font-body text-sm text-gold-body hover:text-gold">
            View all brands
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storefronts.map((s) => (
            <li key={s.store_slug}>
              <Link
                href={`/shop/storefront/${s.store_slug}`}
                className="flex items-center gap-3 rounded-brand-md border border-gold/15 bg-navy-lift p-4 transition hover:border-gold/40"
              >
                <Store className="h-8 w-8 text-gold" aria-hidden />
                <span className="font-heading text-lg text-cream">{s.store_name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-content px-4 pb-16 sm:px-6 lg:px-8">
        <GoldButton label="Gold Partner? Open a storefront" href="/for-brands" variant="outlined" />
      </section>
    </div>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  href,
}: {
  title: string;
  subtitle?: string;
  products: Awaited<ReturnType<typeof fetchProducts>>["products"];
  href?: string;
}) {
  return (
    <section className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl text-gold">{title}</h2>
          {subtitle && <p className="mt-1 font-body text-sm text-gold-body">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="font-body text-sm text-gold hover:text-gold-light">
            See all
          </Link>
        )}
      </div>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
