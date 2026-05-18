import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const now = new Date().toISOString();

  const { data: due } = await admin
    .from("messages")
    .select("id, thread_id, created_at")
    .eq("delivered", false)
    .not("scheduled_for", "is", null)
    .lte("scheduled_for", now)
    .limit(100);

  let processed = 0;
  for (const msg of due ?? []) {
    await admin
      .from("messages")
      .update({ delivered: true, created_at: now })
      .eq("id", msg.id);

    await admin
      .from("threads")
      .update({ last_message_at: now })
      .eq("id", msg.thread_id);

    processed++;
  }

  return NextResponse.json({ processed });
}
