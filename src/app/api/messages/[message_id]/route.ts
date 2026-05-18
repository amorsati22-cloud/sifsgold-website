import { NextResponse } from "next/server";
import { requireMessagingUser, userInThread } from "@/lib/messaging/server";

export const runtime = "nodejs";

type RouteCtx = { params: { message_id: string } };

export async function PATCH(request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data: existing } = await session.supabase
    .from("messages")
    .select("thread_id, sender_id")
    .eq("id", params.message_id)
    .maybeSingle();

  if (!existing || existing.sender_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await session.supabase
    .from("messages")
    .update({
      encrypted_body: body.encrypted_body,
      iv: body.iv,
      edited: true,
      edited_at: new Date().toISOString(),
    })
    .eq("id", params.message_id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}

export async function DELETE(_request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: existing } = await session.supabase
    .from("messages")
    .select("thread_id, sender_id")
    .eq("id", params.message_id)
    .maybeSingle();

  if (!existing || existing.sender_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!(await userInThread(existing.thread_id as string, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await session.supabase
    .from("messages")
    .update({ deleted: true })
    .eq("id", params.message_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
