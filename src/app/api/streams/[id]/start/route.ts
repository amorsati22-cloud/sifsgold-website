import { NextResponse } from "next/server";
import { activateLiveStream } from "@/lib/streaming/activate";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const result = await activateLiveStream(
    id,
    user.id,
    profile?.full_name ?? profile?.email ?? "Streamer",
  );

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.error === "Forbidden" ? 403 : 503 });
  }

  return NextResponse.json(result);
}
