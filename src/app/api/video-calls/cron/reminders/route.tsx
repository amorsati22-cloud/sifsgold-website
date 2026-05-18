import { NextResponse } from "next/server";
import { videoCallLobbyUrl } from "@/lib/video-calls/booking-hook";
import { VideoCallReminder } from "@/lib/email/templates/VideoCallReminder";
import { isResendConfigured, sendEmail } from "@/lib/email/resend-client";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://sifsgold.com";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const inOneHour = new Date(Date.now() + 60 * 60 * 1000);
  const inFiftyFive = new Date(Date.now() + 55 * 60 * 1000);

  const { data: sessions } = await admin
    .from("video_call_sessions")
    .select(
      "id, title, scheduled_start, host_id, video_call_participants(user_id, invite_email, profiles(email, full_name))",
    )
    .eq("status", "scheduled")
    .gte("scheduled_start", inFiftyFive.toISOString())
    .lte("scheduled_start", inOneHour.toISOString());

  if (!isResendConfigured()) {
    return NextResponse.json({ sent: 0, reason: "email_not_configured" });
  }

  let sent = 0;
  for (const session of sessions ?? []) {
    const lobbyUrl = videoCallLobbyUrl(session.id as string);
    const participants = session.video_call_participants as Array<{
      profiles?: { email?: string; full_name?: string };
      invite_email?: string;
    }>;

    for (const p of participants ?? []) {
      const email = p.profiles?.email ?? p.invite_email;
      if (!email) continue;
      await sendEmail({
        to: email,
        subject: `Video call in 1 hour: ${session.title ?? "Sif's Gold"}`,
        react: (
          <VideoCallReminder
            recipientEmail={email}
            title={(session.title as string) ?? "Video call"}
            lobbyUrl={lobbyUrl}
            viewInBrowserUrl={lobbyUrl}
            unsubscribeUrl={`${SITE_URL}/legal/privacy`}
            preferencesUrl={`${SITE_URL}/account`}
          />
        ),
      });
      sent++;
    }
  }

  return NextResponse.json({ sent });
}
