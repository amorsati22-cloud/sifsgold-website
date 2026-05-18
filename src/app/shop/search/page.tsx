import { Suspense } from "react";
import { ShopSearchClient } from "@/app/shop/search/ShopSearchClient";
import { fetchProducts } from "@/lib/shop/products";
import { createClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ q?: string; sort?: string; category?: string; page?: string }> };

export default async function ShopSearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const query = params.q ?? "";

  const categories =
    supabase
      ? (await supabase.from("product_categories").select("id, label").order("display_order")).data ?? []
      : [];

  const { products, total } = supabase
    ? await fetchProducts(supabase, {
        search: query,
        category: params.category,
        sort: (params.sort as "relevance") ?? "relevance",
        page: Number(params.page) || 1,
      })
    : { products: [], total: 0 };

  return (
    <Suspense>
      <ShopSearchClient
        categories={categories}
        initialProducts={products}
        initialTotal={total}
        initialQuery={query}
      />
    </Suspense>
  );
}
