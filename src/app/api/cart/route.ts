import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  guestCartCookieOptions,
  mergeGuestIntoUserCart,
  parseGuestCart,
  serializeGuestCart,
  type GuestCartItem,
} from "@/lib/shop/cart";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function enrichCart(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, userId: string) {
  const { data: items } = await supabase
    .from("cart_items")
    .select(
      `id, product_id, variant_id, quantity,
       product:products(*, storefront:storefronts(id, store_name, store_slug, verified)),
       variant:product_variants(*)`,
    )
    .eq("user_id", userId);

  return items ?? [];
}

export async function GET() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  if (!supabase) {
    const guest = parseGuestCart(cookieStore.get(guestCartCookieOptions().name)?.value);
    return NextResponse.json({ items: guest, guest: true });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const guest = parseGuestCart(cookieStore.get(guestCartCookieOptions().name)?.value);
    return NextResponse.json({ items: guest, guest: true });
  }

  const items = await enrichCart(supabase, user.id);
  return NextResponse.json({ items, guest: false });
}

export async function POST(request: Request) {
  const body = (await request.json()) as GuestCartItem;
  const supabase = await createClient();
  const cookieStore = await cookies();

  if (!body?.product_id || !body.quantity || body.quantity < 1) {
    return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  }

  if (!supabase) {
    const guest = parseGuestCart(cookieStore.get(guestCartCookieOptions().name)?.value);
    const merged = mergeGuestIntoUserCart(guest, [
      { product_id: body.product_id, variant_id: body.variant_id, quantity: body.quantity },
    ]);
    const res = NextResponse.json({ ok: true, guest: true });
    res.cookies.set(guestCartCookieOptions().name, serializeGuestCart(merged), guestCartCookieOptions());
    return res;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const guest = parseGuestCart(cookieStore.get(guestCartCookieOptions().name)?.value);
    const merged = mergeGuestIntoUserCart(guest, [
      { product_id: body.product_id, variant_id: body.variant_id, quantity: body.quantity },
    ]);
    const res = NextResponse.json({ ok: true, guest: true });
    res.cookies.set(guestCartCookieOptions().name, serializeGuestCart(merged), guestCartCookieOptions());
    return res;
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", body.product_id)
    .eq("variant_id", body.variant_id ?? null)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + body.quantity })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: body.product_id,
      variant_id: body.variant_id ?? null,
      quantity: body.quantity,
    });
  }

  const items = await enrichCart(supabase, user.id);
  return NextResponse.json({ ok: true, items });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string; product_id?: string; variant_id?: string | null; quantity: number };
  const supabase = await createClient();
  const cookieStore = await cookies();

  if (!body.quantity || body.quantity < 1) {
    return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
  }

  if (!supabase) {
    let guest = parseGuestCart(cookieStore.get(guestCartCookieOptions().name)?.value);
    guest = guest.map((g) =>
      g.product_id === body.product_id && (g.variant_id ?? null) === (body.variant_id ?? null)
        ? { ...g, quantity: body.quantity }
        : g,
    );
    const res = NextResponse.json({ ok: true });
    res.cookies.set(guestCartCookieOptions().name, serializeGuestCart(guest), guestCartCookieOptions());
    return res;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (body.id) {
    await supabase.from("cart_items").update({ quantity: body.quantity }).eq("id", body.id).eq("user_id", user.id);
  } else if (body.product_id) {
    await supabase
      .from("cart_items")
      .update({ quantity: body.quantity })
      .eq("user_id", user.id)
      .eq("product_id", body.product_id)
      .eq("variant_id", body.variant_id ?? null);
  }

  return NextResponse.json({ ok: true, items: await enrichCart(supabase, user.id) });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const productId = searchParams.get("product_id");
  const variantId = searchParams.get("variant_id");

  const supabase = await createClient();
  const cookieStore = await cookies();

  if (!supabase) {
    let guest = parseGuestCart(cookieStore.get(guestCartCookieOptions().name)?.value);
    if (productId) {
      guest = guest.filter(
        (g) => !(g.product_id === productId && (g.variant_id ?? null) === (variantId || null)),
      );
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(guestCartCookieOptions().name, serializeGuestCart(guest), guestCartCookieOptions());
    return res;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (id) {
    await supabase.from("cart_items").delete().eq("id", id).eq("user_id", user.id);
  } else if (productId) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("variant_id", variantId || null);
  }

  return NextResponse.json({ ok: true, items: await enrichCart(supabase, user.id) });
}
