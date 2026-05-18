import { NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { error } = await session.supabase.from("message_reports").insert({
    reporter_id: session.user.id,
    message_id: body.message_id ?? null,
    reported_user_id: body.reported_user_id ?? null,
    reason: body.reason ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
