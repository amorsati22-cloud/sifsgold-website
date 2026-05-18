import "server-only";

import { MESSAGE_FILE_MAX_BYTES, MESSAGE_THREAD_DAILY_MAX_BYTES } from "@/lib/messaging/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export function validateFileSize(size: number): { ok: boolean; error?: string } {
  if (size > MESSAGE_FILE_MAX_BYTES) {
    return { ok: false, error: `File exceeds ${MESSAGE_FILE_MAX_BYTES / (1024 * 1024)}MB limit` };
  }
  return { ok: true };
}

export async function validateThreadDailyQuota(
  threadId: string,
  additionalBytes: number,
): Promise<{ ok: boolean; error?: string; used?: number }> {
  const admin = createAdminClient();
  if (!admin) return { ok: true };

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { data } = await admin
    .from("messages")
    .select("file_metadata")
    .eq("thread_id", threadId)
    .eq("message_type", "file")
    .gte("created_at", startOfDay.toISOString());

  let used = 0;
  for (const row of data ?? []) {
    const meta = row.file_metadata as { size?: number } | null;
    used += meta?.size ?? 0;
  }

  if (used + additionalBytes > MESSAGE_THREAD_DAILY_MAX_BYTES) {
    return {
      ok: false,
      error: `Thread daily upload limit (${MESSAGE_THREAD_DAILY_MAX_BYTES / (1024 * 1024)}MB) exceeded`,
      used,
    };
  }
  return { ok: true, used };
}
