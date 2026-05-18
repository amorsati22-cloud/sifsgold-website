import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { ProductDetailClient } from "@/app/shop/product/[slug]/ProductDetailClient";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { StarRating } from "@/components/shop/StarRating";
import { canPurchaseProOnlyProduct } from "@/lib/shop/license-verification";
import { fetchProductBySlug, fetchProductVariants, fetchProducts } from "@/lib/shop/products";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return (
      <p className="mx-auto max-w-content px-4 py-16 font-body text-gold-body">
        Connect Supabase to load products.
      </p>
    );
  }

  const product = await fetchProductBySlug(supabase, slug);
  if (!product) {
    return <p className="mx-auto max-w-content px-4 py-16 font-body text-cream">Product not found.</p>;
  }

  const variants = await fetchProductVariants(supabase, product.id);
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("id, rating, title, body, created_at")
    .eq("product_id", product.id)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: questions } = await supabase
    .from("product_question_answers")
    .select("question, answer, created_at")
    .eq("product_id", product.id)
    .not("answer", "is", null)
    .limit(10);

  const related = await fetchProducts(supabase, {
    category: product.category ?? undefined,
    pageSize: 4,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("user_type").eq("id", user.id).maybeSingle()
    : { data: null };

  const { data: proProfile } = user
    ? await supabase.from("pro_profiles").select("license_verified, specialties").eq("id", user.id).maybeSingle()
    : { data: null };

  const licenseCheck = canPurchaseProOnlyProduct(product, {
    userType: profile?.user_type,
    licenseVerified: proProfile?.license_verified ?? false,
    specialties: proProfile?.specialties,
  });

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 font-body text-sm text-gold-body" aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/shop/category/${product.category}`}>{product.category}</Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-cream">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImageGallery images={product.images ?? []} productName={product.name} />
        <div>
          {product.brand && <p className="font-body text-sm uppercase text-gold-body">{product.brand}</p>}
          <h1 className="font-heading text-3xl text-gold md:text-4xl">{product.name}</h1>
          {product.average_rating != null && (
            <div className="mt-2">
              <StarRating rating={Number(product.average_rating)} showValue />
              <span className="ml-2 font-body text-sm text-gold-body">({product.total_reviews} reviews)</span>
            </div>
          )}
          {product.storefront && (
            <p className="mt-4 font-body text-sm text-cream/80">
              Sold by{" "}
              <Link href={`/shop/storefront/${product.storefront.store_slug}`} className="text-gold hover:underline">
                {product.storefront.store_name}
              </Link>
              {product.storefront.verified && (
                <span className="ml-2 rounded-brand-sm bg-teal/20 px-2 py-0.5 text-xs text-teal">Verified Gold Partner</span>
              )}
            </p>
          )}
          <div className="mt-6">
            <ProductDetailClient
              product={product}
              variants={variants}
              canPurchase={licenseCheck.allowed}
              blockReason={licenseCheck.reason}
            />
          </div>
        </div>
      </div>

      <Tabs.Root defaultValue="details" className="mt-12">
        <Tabs.List className="flex flex-wrap gap-2 border-b border-gold/20" aria-label="Product information">
          {["details", "ingredients", "usage", "warnings", "shipping", "returns"].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="rounded-t-brand-sm px-4 py-2 font-body text-sm capitalize text-cream/70 data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="details" className="prose prose-invert max-w-none py-6 font-body text-cream/90">
          {product.description ?? product.short_description ?? "No description."}
        </Tabs.Content>
        <Tabs.Content value="ingredients" className="py-6 font-body text-cream/90">
          {product.ingredients ?? "Ingredients listed on packaging."}
        </Tabs.Content>
        <Tabs.Content value="usage" className="py-6 font-body text-cream/90">
          {product.usage_instructions ?? "Follow manufacturer directions."}
        </Tabs.Content>
        <Tabs.Content value="warnings" className="py-6 font-body text-cream/90">
          {product.warnings ?? "For professional use only where indicated."}
        </Tabs.Content>
        <Tabs.Content value="shipping" className="py-6 font-body text-cream/90">
          {product.storefront?.shipping_policy ?? "Ships from verified Gold Partner warehouses. Rates calculated at checkout."}
        </Tabs.Content>
        <Tabs.Content value="returns" className="py-6 font-body text-cream/90">
          {product.storefront?.return_policy ?? "30-day returns on unopened retail items. Professional chemicals may have restricted return eligibility."}
        </Tabs.Content>
      </Tabs.Root>

      <section className="mt-12">
        <h2 className="font-heading text-2xl text-gold">Reviews</h2>
        <ul className="mt-4 space-y-4">
          {(reviews ?? []).map((r) => (
            <li key={r.id} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
              <StarRating rating={r.rating} />
              {r.title && <p className="mt-2 font-heading text-cream">{r.title}</p>}
              <p className="mt-1 font-body text-sm text-cream/80">{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl text-gold">Q&amp;A</h2>
        <ul className="mt-4 space-y-4">
          {(questions ?? []).map((q, i) => (
            <li key={i} className="rounded-brand-md border border-gold/15 bg-navy-lift p-4">
              <p className="font-body font-medium text-cream">Q: {q.question}</p>
              <p className="mt-2 font-body text-sm text-gold-body">A: {q.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {related.products.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl text-gold">Related products</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.products
              .filter((p) => p.id !== product.id)
              .map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
