import { NextResponse } from "next/server";
import { validateFileSize, validateThreadDailyQuota } from "@/lib/messaging/file-limits";
import { getParticipantIds, requireMessagingUser, userInThread } from "@/lib/messaging/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireMessagingUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const threadId = body.thread_id as string;
  const fileMeta = body.file_metadata as { name: string; size: number; mime_type: string };

  const sizeCheck = validateFileSize(fileMeta.size);
  if (!sizeCheck.ok) return NextResponse.json({ error: sizeCheck.error }, { status: 400 });

  const quota = await validateThreadDailyQuota(threadId, fileMeta.size);
  if (!quota.ok) return NextResponse.json({ error: quota.error }, { status: 400 });

  if (!(await userInThread(threadId, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const participantIds = await getParticipantIds(threadId);

  const { data: message, error } = await session.supabase
    .from("messages")
    .insert({
      thread_id: threadId,
      sender_id: session.user.id,
      message_type: "file",
      encrypted_body: body.encrypted_body,
      iv: body.iv,
      file_metadata: { ...fileMeta, storage_path: body.storage_path },
      encrypted_attachments: body.encrypted_attachments ?? null,
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
      encrypted_last_preview: body.encrypted_preview,
      preview_iv: body.preview_iv,
    })
    .eq("id", threadId);

  return NextResponse.json({ message, participant_ids: participantIds });
}
