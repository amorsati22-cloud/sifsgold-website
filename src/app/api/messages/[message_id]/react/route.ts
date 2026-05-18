import { NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/server";

export const runtime = "nodejs";

type RouteCtx = { params: { message_id: string } };

export async function POST(request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { emoji } = await request.json();
  if (!emoji) return NextResponse.json({ error: "emoji required" }, { status: 400 });

  const { error } = await session.supabase.from("message_reactions").upsert({
    message_id: params.message_id,
    user_id: session.user.id,
    emoji,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const emoji = searchParams.get("emoji");
  if (!emoji) return NextResponse.json({ error: "emoji required" }, { status: 400 });

  await session.supabase
    .from("message_reactions")
    .delete()
    .eq("message_id", params.message_id)
    .eq("user_id", session.user.id)
    .eq("emoji", emoji);

  return NextResponse.json({ ok: true });
}
