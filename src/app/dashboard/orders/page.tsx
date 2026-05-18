import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { formatCurrency } from "@/lib/shop/format";
import { createClient } from "@/lib/supabase/server";

const BUYER_NAV = [
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/returns", label: "Returns" },
];

type Props = { searchParams: Promise<{ status?: string }> };

export default async function BuyerOrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const supabase = await createClient();

  if (!supabase) {
    return <p className="px-4 py-16 font-body text-gold-body">Sign in to view orders.</p>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <p className="px-4 py-16 font-body text-gold-body">Please sign in.</p>;
  }

  let query = supabase.from("orders").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data: orders } = await query;

  return (
    <DashboardShell
      title="Your orders"
      description="Track purchases from Gold Partners in the Beauty Supply Store."
      nav={BUYER_NAV}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["", "paid", "processing", "shipped", "delivered"].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/dashboard/orders?status=${s}` : "/dashboard/orders"}
            className={`rounded-brand-full px-3 py-1 font-body text-xs ${
              (status ?? "") === s ? "bg-gold text-navy" : "border border-gold/30 text-cream"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>
      <ul className="space-y-3">
        {(orders ?? []).map((o) => (
          <li key={o.id}>
            <Link
              href={`/dashboard/orders/${o.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-brand-md border border-gold/15 bg-navy-lift p-4 transition hover:border-gold/40"
            >
              <span className="font-body text-gold">{o.order_number}</span>
              <span className="font-body text-sm capitalize text-cream/70">{o.status}</span>
              <span className="font-body text-cream">{formatCurrency(Number(o.total))}</span>
            </Link>
          </li>
        ))}
      </ul>
      {(orders ?? []).length === 0 && (
        <p className="font-body text-gold-body">No orders yet. <Link href="/shop" className="text-gold underline">Shop the store</Link>.</p>
      )}
    </DashboardShell>
  );
}
