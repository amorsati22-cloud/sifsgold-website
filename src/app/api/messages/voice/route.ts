import { NextResponse } from "next/server";
import { MESSAGE_VOICE_BUCKET } from "@/lib/messaging/constants";
import { getParticipantIds, requireMessagingUser, userInThread } from "@/lib/messaging/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const threadId = body.thread_id as string;
  if (!(await userInThread(threadId, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const participantIds = await getParticipantIds(threadId);

  const { data: message, error } = await session.supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: session.user.id,
      message_type: "voice_note",
      encrypted_body: body.encrypted_body,
      iv: body.iv,
      voice_note_duration_seconds: body.duration_seconds,
      voice_note_waveform: body.waveform,
      encrypted_attachments: body.encrypted_storage_path ?? null,
      attachments_iv: body.attachments_iv ?? null,
      delivered_to: participantIds.filter((id) => id !== session.user.id),
      read_by: [session.user.id],
      delivered: true,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const admin = createAdminClient();
  await (admin ?? session.supabase)
    .from("threads")
    .update({
      last_message_at: message.created_at,
      encrypted_last_preview: body.encrypted_preview ?? body.encrypted_body,
      preview_iv: body.preview_iv ?? body.iv,
    })
    .eq("id", threadId);

  return NextResponse.json({ message, participant_ids: participantIds });
}
