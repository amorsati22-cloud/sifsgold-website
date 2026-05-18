import type { SupabaseClient } from "@supabase/supabase-js";
import type { SortValue } from "@/lib/shop/constants";
import type { ProductRow } from "@/lib/shop/types";

const PRODUCT_SELECT = `
  *,
  storefront:storefronts(id, store_name, store_slug, verified, store_active)
`;

export type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRating?: number;
  inStockOnly?: boolean;
  proOnly?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  storefrontId?: string;
  sort?: SortValue;
  page?: number;
  pageSize?: number;
};

export async function fetchProducts(
  supabase: SupabaseClient,
  filters: ProductFilters = {},
): Promise<{ products: ProductRow[]; total: number }> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("active", true);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.brand) query = query.ilike("brand", `%${filters.brand}%`);
  if (filters.storefrontId) query = query.eq("storefront_id", filters.storefrontId);
  if (filters.featured) query = query.eq("featured", true);
  if (filters.bestseller) query = query.eq("bestseller", true);
  if (filters.newArrival) query = query.eq("new_arrival", true);
  if (filters.proOnly !== undefined) query = query.eq("pro_only", filters.proOnly);
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
  if (filters.minRating != null) query = query.gte("average_rating", filters.minRating);
  if (filters.inStockOnly) {
    query = query.or("track_inventory.eq.false,inventory_count.gt.0,backorder_allowed.eq.true");
  }

  if (filters.search?.trim()) {
    const term = filters.search.trim();
    query = query.or(`name.ilike.%${term}%,brand.ilike.%${term}%,search_keywords.cs.{${term}}`);
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "rating":
      query = query.order("average_rating", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order("featured", { ascending: false }).order("bestseller", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    return { products: [], total: 0 };
  }

  return { products: (data ?? []) as ProductRow[], total: count ?? 0 };
}

export async function fetchProductBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<ProductRow | null> {
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  return (data as ProductRow | null) ?? null;
}

export async function fetchProductVariants(supabase: SupabaseClient, productId: string) {
  const { data } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("name");

  return data ?? [];
}
