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

  let existingId: string | null = null;
  if (body.client_id) {
    const { data } = await supabase
      .from("pro_client_notes")
      .select("id")
      .eq("pro_id", user.id)
      .eq("client_id", body.client_id)
      .maybeSingle();
    existingId = data?.id ?? null;
  } else if (body.guest_key) {
    const { data } = await supabase
      .from("pro_client_notes")
      .select("id")
      .eq("pro_id", user.id)
      .eq("guest_key", body.guest_key)
      .maybeSingle();
    existingId = data?.id ?? null;
  }

  if (existingId) {
    const { error } = await supabase.from("pro_client_notes").update(row).eq("id", existingId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase.from("pro_client_notes").insert(row);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
