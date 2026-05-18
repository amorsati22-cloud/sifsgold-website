import { NextResponse } from "next/server";
import { areUsersBlocked, findExistingDmThread, requireMessagingUser } from "@/lib/messaging/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { supabase, user } = session;

  const { data: memberships } = await supabase
    .from("thread_participants")
    .select(
      `thread_id, last_read_at, muted, thread:threads(id, created_at, last_message_at, thread_type, linked_appointment_id, title, avatar_url, created_by, encrypted_last_preview, preview_iv)`,
    )
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const threads = await Promise.all(
    (memberships ?? []).map(async (m) => {
      const thread = m.thread as Record<string, unknown> | null;
      if (!thread) return null;

      const { data: participants } = await supabase
        .from("thread_participants")
        .select("user_id, role, last_read_at")
        .eq("thread_id", thread.id as string);

      const participantIds = (participants ?? []).map((p) => p.user_id as string);

      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("thread_id", thread.id as string)
        .gt("created_at", m.last_read_at ?? "1970-01-01")
        .neq("sender_id", user.id);

      const others = participantIds.filter((id) => id !== user.id);
      let otherProfiles: { id: string; label: string; username?: string; avatar_url?: string | null }[] = [];
      if (others.length > 0) {
        const { data: pros } = await supabase
          .from("pro_profiles")
          .select("id, display_name, username, avatar_url")
          .in("id", others);
        const found = new Set((pros ?? []).map((p) => p.id as string));
        otherProfiles = (pros ?? []).map((p) => ({
          id: p.id as string,
          label: (p.display_name as string) ?? "User",
          avatar_url: p.avatar_url as string | null,
          username: p.username as string,
        }));
        for (const oid of others) {
          if (!found.has(oid)) {
            otherProfiles.push({ id: oid, label: "Member" });
          }
        }
      }

      return {
        ...thread,
        participant_ids: participantIds,
        unread_count: count ?? 0,
        other_participants: otherProfiles,
        muted: m.muted,
      };
    }),
  );

  const sorted = threads
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date((b as { last_message_at: string | null }).last_message_at ?? 0).getTime() -
        new Date((a as { last_message_at: string | null }).last_message_at ?? 0).getTime(),
    );

  return NextResponse.json({ threads: sorted });
}

export async function POST(request: Request) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const participantIds: string[] = [...new Set([...(body.participant_ids ?? []), session.user.id])];
  const threadType = body.thread_type ?? "dm";

  if (participantIds.length < 2 && threadType === "dm") {
    return NextResponse.json({ error: "DM requires another participant" }, { status: 400 });
  }

  for (const pid of participantIds) {
    if (pid === session.user.id) continue;
    if (await areUsersBlocked(session.user.id, pid)) {
      return NextResponse.json({ error: "Cannot message this user" }, { status: 403 });
    }
  }

  if (threadType === "dm" && participantIds.length === 2) {
    const existing = await findExistingDmThread(participantIds[0], participantIds[1]);
    if (existing) {
      return NextResponse.json({ thread_id: existing, participant_ids: participantIds });
    }
  }

  const admin = createAdminClient();
  const db = admin ?? session.supabase;

  const { data: thread, error } = await db
    .from("threads")
    .insert({
      thread_type: threadType,
      linked_appointment_id: body.linked_appointment_id ?? null,
      title: body.title ?? null,
      created_by: session.user.id,
    })
    .select("id")
    .single();

  if (error || !thread) {
    return NextResponse.json({ error: error?.message ?? "Could not create thread" }, { status: 500 });
  }

  const rows = participantIds.map((uid, i) => ({
    thread_id: thread.id,
    user_id: uid,
    role: uid === session.user.id && i === 0 ? "admin" : "member",
  }));

  await db.from("thread_participants").insert(rows);

  return NextResponse.json({ thread_id: thread.id, participant_ids: participantIds });
}
