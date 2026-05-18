import { NextResponse } from "next/server";
import { getParticipantIds, requireMessagingUser, userInThread } from "@/lib/messaging/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteCtx = { params: { thread_id: string } };

/** Add/remove participants and rotate group encryption key version. */
export async function PATCH(request: Request, { params }: RouteCtx) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const threadId = params.thread_id;
  if (!(await userInThread(threadId, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { add?: string[]; remove?: string };
  const admin = createAdminClient();
  const db = admin ?? session.supabase;

  const { data: thread } = await db.from("threads").select("thread_type, group_key_version").eq("id", threadId).single();
  if (!thread || thread.thread_type !== "group") {
    return NextResponse.json({ error: "Not a group thread" }, { status: 400 });
  }

  if (body.remove) {
    await db.from("thread_participants").delete().eq("thread_id", threadId).eq("user_id", body.remove);
  }
  if (body.add?.length) {
    const rows = body.add.map((uid) => ({ thread_id: threadId, user_id: uid, role: "member" }));
    await db.from("thread_participants").upsert(rows);
  }

  const newVersion = (thread.group_key_version ?? 1) + 1;
  await db.from("threads").update({ group_key_version: newVersion }).eq("id", threadId);

  const participantIds = await getParticipantIds(threadId);
  return NextResponse.json({ group_key_version: newVersion, participant_ids: participantIds });
}
