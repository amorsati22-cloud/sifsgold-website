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
  if (!user) return NextResponse.json({ ok: true });

  await supabase.from("client_pro_views").upsert(
    {
      client_id: user.id,
      pro_id: body.pro_id,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "client_id,pro_id" },
  );

  return NextResponse.json({ ok: true });
}
