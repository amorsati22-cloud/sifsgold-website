import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { EMAIL_FROM } from "@/lib/email/constants";
import { isResendConfigured, sendEmail } from "@/lib/email/resend-client";
import { NotificationDigest } from "@/lib/email/templates/NotificationDigest";
import type { DigestFrequency } from "@/lib/notifications/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifsgold.com";

function shouldSendDigest(
  frequency: DigestFrequency,
  lastSent: string | null,
  now: Date,
): boolean {
  if (frequency === "never") return false;
  if (!lastSent) return true;

  const last = new Date(lastSent);
  const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

  if (frequency === "daily") return hoursSince >= 20;
  if (frequency === "weekly") {
    const day = now.getUTCDay();
    return day === 1 && hoursSince >= 20;
  }
  return false;
}

export async function runNotificationDigests(admin: SupabaseClient): Promise<{
  sent: number;
  skipped: number;
}> {
  if (!isResendConfigured()) return { sent: 0, skipped: 0 };

  const now = new Date();

  const { data: prefsRows } = await admin
    .from("notification_preferences")
    .select("id, digest_frequency, digest_last_sent_at, email_enabled, push_enabled")
    .neq("digest_frequency", "never")
    .eq("email_enabled", true);

  let sent = 0;
  let skipped = 0;

  for (const prefs of prefsRows ?? []) {
    const frequency = prefs.digest_frequency as DigestFrequency;
    if (!shouldSendDigest(frequency, prefs.digest_last_sent_at as string | null, now)) {
      skipped += 1;
      continue;
    }

    const { data: unread } = await admin
      .from("notifications")
      .select("title, body, action_url, category, created_at")
      .eq("user_id", prefs.id)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(25);

    if (!unread?.length) {
      skipped += 1;
      continue;
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("id", prefs.id)
      .maybeSingle();

    const email = profile?.email as string | undefined;
    if (!email) {
      skipped += 1;
      continue;
    }

    const periodLabel = frequency === "weekly" ? "weekly" : "daily";

    try {
      await sendEmail({
        to: email,
        from: EMAIL_FROM.notifications,
        subject: `Your ${periodLabel} SIFS GOLD digest (${unread.length} updates)`,
        react: NotificationDigest({
          recipientEmail: email,
          recipientName: (profile?.full_name as string) ?? undefined,
          items: unread.map((n) => ({
            title: n.title as string,
            body: (n.body as string) ?? undefined,
            actionUrl: n.action_url ? `${SITE_URL}${n.action_url}` : undefined,
            category: n.category as string,
          })),
          preferencesUrl: `${SITE_URL}/dashboard/notifications/preferences`,
          viewAllUrl: `${SITE_URL}/dashboard/notifications`,
          periodLabel,
        }),
      });

      await admin
        .from("notification_preferences")
        .update({ digest_last_sent_at: now.toISOString() })
        .eq("id", prefs.id);

      sent += 1;
    } catch {
      skipped += 1;
    }
  }

  return { sent, skipped };
}
