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

  const { error } = await supabase.from("client_settings").upsert({
    client_id: user.id,
    email_reminders: body.email_reminders,
    sms_reminders: body.sms_reminders,
    marketing_email: body.marketing_email,
    profile_visible: body.profile_visible,
    vision_boards_visible_to_pros: body.vision_boards_visible_to_pros,
    location_city: body.location_city,
    location_state: body.location_state,
    location_lat: body.location_lat,
    location_lng: body.location_lng,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
