import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== body.pro_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const row = {
    pro_id: user.id,
    client_id: body.client_id ?? null,
    guest_key: body.guest_key ?? null,
    guest_name: body.guest_name,
    guest_email: body.guest_email,
    guest_phone: body.guest_phone,
    formula_notes: body.formula_notes,
    allergies: body.allergies,
    preferences: body.preferences,
    private_notes: body.private_notes,
    birthday: body.birthday || null,
    next_visit: body.next_visit || null,
    favorite: body.favorite ?? false,
  };

  const { error } = await supabase.from("pro_client_notes").upsert(row, {
    onConflict: body.client_id ? "pro_id,client_id" : undefined,
  });

  if (error && body.guest_key) {
    const { data: existing } = await supabase
      .from("pro_client_notes")
      .select("id")
      .eq("pro_id", user.id)
      .eq("guest_key", body.guest_key)
      .maybeSingle();

    if (existing) {
      await supabase.from("pro_client_notes").update(row).eq("id", existing.id);
    } else {
      await supabase.from("pro_client_notes").insert(row);
    }
    return NextResponse.json({ ok: true });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
