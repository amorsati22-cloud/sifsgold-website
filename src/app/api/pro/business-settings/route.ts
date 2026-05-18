import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("pro_business_settings").upsert({
    id: user.id,
    business_name: body.business_name,
    business_email: body.business_email,
    business_phone: body.business_phone,
    business_address: body.business_address,
    accepts_tips: body.accepts_tips,
    default_tip_percentages: body.default_tip_percentages,
    requires_cancellation_policy_acceptance: body.requires_cancellation_policy_acceptance,
    auto_confirm_bookings: body.auto_confirm_bookings,
    new_client_intake_required: body.new_client_intake_required,
    default_deposit_percent: body.default_deposit_percent,
    cancellation_policy: body.cancellation_policy,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
