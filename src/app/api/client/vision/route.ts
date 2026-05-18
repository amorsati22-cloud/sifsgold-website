import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (body.attached_to_appointment) {
    const { data: appt } = await supabase
      .from("appointments")
      .select("id")
      .eq("id", body.attached_to_appointment)
      .or(`client_id.eq.${user.id}`)
      .maybeSingle();
    if (!appt) return NextResponse.json({ error: "Invalid appointment" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("client_vision_history")
    .insert({
      client_id: user.id,
      title: body.title,
      notes: body.notes,
      image_urls: body.image_urls ?? [],
      attached_to_appointment: body.attached_to_appointment ?? null,
      privacy: "private",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ board: data });
}
