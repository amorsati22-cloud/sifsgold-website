import { NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.blocked_id) {
    return NextResponse.json({ error: "blocked_id required" }, { status: 400 });
  }

  if (body.blocked_id === session.user.id) {
    return NextResponse.json({ error: "Cannot block yourself" }, { status: 400 });
  }

  const { error } = await session.supabase.from("blocked_users").upsert({
    blocker_id: session.user.id,
    blocked_id: body.blocked_id,
    reason: body.reason ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
