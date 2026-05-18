import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const now = new Date().toISOString();
  const { data: expired } = await admin
    .from("video_call_recordings")
    .select("id, storage_path")
    .eq("status", "ready")
    .lt("expires_at", now);

  let deleted = 0;
  for (const rec of expired ?? []) {
    if (rec.storage_path) {
      await admin.storage.from("video-call-recordings").remove([rec.storage_path as string]);
    }
    await admin
      .from("video_call_recordings")
      .update({ status: "deleted" })
      .eq("id", rec.id);
    deleted++;
  }

  return NextResponse.json({ deleted });
}
