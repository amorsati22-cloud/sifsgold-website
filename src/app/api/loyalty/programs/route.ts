import { NextResponse } from "next/server";
import { DEFAULT_TIERS } from "@/lib/loyalty/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("loyalty_programs")
    .select("*")
    .eq("owner_id", user.id);

  return NextResponse.json({ programs: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  let ownerType = "pro";
  if (profile?.user_type === "salon") ownerType = "salon";
  if (profile?.user_type === "brand_partner") ownerType = "brand";

  const { data, error } = await admin
    .from("loyalty_programs")
    .upsert(
      {
        owner_id: user.id,
        owner_type: ownerType,
        name: body.name ?? "Rewards Program",
        description: body.description ?? null,
        points_per_dollar: body.points_per_dollar ?? 1,
        points_per_appointment: body.points_per_appointment ?? 25,
        points_per_referral: body.points_per_referral ?? 100,
        enrollment_bonus: body.enrollment_bonus ?? 50,
        birthday_bonus: body.birthday_bonus ?? 50,
        tiers: body.tiers ?? DEFAULT_TIERS,
        expiration_months: body.expiration_months ?? 12,
        active: body.active ?? true,
      },
      { onConflict: "owner_id" },
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ program: data });
}
