import { NextResponse } from "next/server";
import { assertSessionAccess, getSessionUser } from "@/lib/video-calls/auth";
import { recordParticipantConsent } from "@/lib/video-calls/consent";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { data: participants } = await admin
    .from("video_call_participants")
    .select("*, profiles(full_name, email, avatar_url)")
    .eq("session_id", sessionId);

  return NextResponse.json({ participants: participants ?? [] });
}

type PostBody = {
  user_id?: string;
  invite_email?: string;
  role?: string;
  recording_consent?: boolean;
};

export async function POST(request: Request, { params }: Params) {
  const { id: sessionId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as PostBody;
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  if (typeof body.recording_consent === "boolean") {
    const result = await recordParticipantConsent(
      sessionId,
      user.id,
      body.recording_consent,
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  const access = await assertSessionAccess(sessionId, user.id);
  if (!access.isHost) {
    return NextResponse.json({ error: "Only host can add participants" }, { status: 403 });
  }

  if (!body.user_id && !body.invite_email) {
    return NextResponse.json({ error: "user_id or invite_email required" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("video_call_participants")
    .insert({
      session_id: sessionId,
      user_id: body.user_id ?? null,
      invite_email: body.invite_email?.toLowerCase() ?? null,
      role: body.role ?? "participant",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ participant: data });
}
