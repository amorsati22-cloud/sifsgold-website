import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type PutBody = {
  pro_id: string;
  timezone: string;
  days: { day_of_week: number; enabled: boolean; start_time: string; end_time: string }[];
};

export async function PUT(request: Request) {
  const body = (await request.json()) as PutBody;
  const supabase = await createClient();
  const admin = createAdminClient();

  if (!supabase || !admin) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== body.pro_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await admin.from("availability_rules").delete().eq("pro_id", body.pro_id);

  const inserts = body.days
    .filter((d) => d.enabled)
    .map((d) => ({
      pro_id: body.pro_id,
      day_of_week: d.day_of_week,
      start_time: d.start_time,
      end_time: d.end_time,
      timezone: body.timezone,
      active: true,
    }));

  if (inserts.length > 0) {
    const { error } = await admin.from("availability_rules").insert(inserts);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await admin.from("pro_profiles").update({ timezone: body.timezone }).eq("id", body.pro_id);

  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  const admin = createAdminClient();

  if (!supabase || !admin) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== body.pro_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data, error } = await admin
    .from("availability_overrides")
    .insert({
      pro_id: body.pro_id,
      override_date: body.override.override_date,
      type: body.override.type,
      start_time: body.override.start_time ?? null,
      end_time: body.override.end_time ?? null,
      reason: body.override.reason ?? null,
      recurring: body.override.recurring ?? false,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ override: data });
}
