import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopSearchBar } from "@/components/shop/ShopSearchBar";
import { fetchProducts } from "@/lib/shop/products";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const supabase = await createClient();

  const { data: cat } = supabase
    ? await supabase.from("product_categories").select("label, parent_category").eq("id", category).maybeSingle()
    : { data: null };

  const subcategories = supabase
    ? (await supabase.from("product_categories").select("id, label").eq("parent_category", category)).data ?? []
    : [];

  const { products, total } = supabase
    ? await fetchProducts(supabase, { category, pageSize: 48 })
    : { products: [], total: 0 };

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-4 font-body text-sm text-gold-body" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-gold">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream">{cat?.label ?? category}</span>
      </nav>
      <h1 className="font-heading text-3xl text-gold">{cat?.label ?? category}</h1>
      <div className="mt-6 max-w-xl">
        <ShopSearchBar />
      </div>
      {subcategories.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {subcategories.map((s) => (
            <li key={s.id}>
              <Link
                href={`/shop/category/${s.id}`}
                className="rounded-brand-full border border-gold/30 px-3 py-1 font-body text-sm text-cream hover:border-gold"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 font-body text-sm text-gold-body">{total} products</p>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
