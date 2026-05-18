import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { EMAIL_FROM } from "@/lib/email/constants";
import { isResendConfigured, sendEmail } from "@/lib/email/resend-client";
import { NotificationInstant } from "@/lib/email/templates/NotificationInstant";
import {
  categoryAllows,
  getOrCreatePreferences,
  isQuietHours,
} from "@/lib/notifications/preferences";
import { sendPushToUser } from "@/lib/notifications/push";
import type { DispatchInput } from "@/lib/notifications/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifsgold.com";

export async function dispatchNotification(
  admin: SupabaseClient,
  input: DispatchInput,
): Promise<{ notificationId?: string; channels: string[] }> {
  const prefs = await getOrCreatePreferences(admin, input.userId);
  const channels: string[] = [];

  const allowInApp = categoryAllows(prefs, input.category, "in_app");
  const allowPush =
    categoryAllows(prefs, input.category, "push") && (!isQuietHours(prefs) || input.urgent);
  const allowEmail =
    categoryAllows(prefs, input.category, "email") &&
    prefs.digest_frequency === "never" &&
    !input.digestOnly;

  let notificationId: string | undefined;

  if (allowInApp) {
    const { data: row } = await admin
      .from("notifications")
      .insert({
        user_id: input.userId,
        category: input.category,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        icon_url: input.iconUrl ?? null,
        action_url: input.actionUrl ?? null,
        expires_at: input.expiresAt ?? null,
      })
      .select("id")
      .single();

    notificationId = row?.id as string | undefined;
    channels.push("in_app");
  }

  if (allowPush) {
    const result = await sendPushToUser(admin, input.userId, {
      title: input.title,
      body: input.body,
      icon: input.iconUrl,
      url: input.actionUrl ? `${SITE_URL}${input.actionUrl}` : `${SITE_URL}/dashboard/notifications`,
    });
    if (result.sent > 0) channels.push("push");
  }

  if (allowEmail) {
    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("id", input.userId)
      .maybeSingle();

    const email = profile?.email as string | undefined;
    if (email && isResendConfigured()) {
      try {
        await sendEmail({
          to: email,
          from: EMAIL_FROM.notifications,
          subject: input.title,
          react: NotificationInstant({
            recipientEmail: email,
            title: input.title,
            body: input.body,
            actionUrl: input.actionUrl ? `${SITE_URL}${input.actionUrl}` : undefined,
            preferencesUrl: `${SITE_URL}/dashboard/notifications/preferences`,
            viewAllUrl: `${SITE_URL}/dashboard/notifications`,
          }),
        });
        channels.push("email");
      } catch {
        // best-effort
      }
    }
  }

  return { notificationId, channels };
}

/** Notify multiple users (e.g. thread participants). */
export async function dispatchToUsers(
  admin: SupabaseClient,
  userIds: string[],
  input: Omit<DispatchInput, "userId">,
) {
  const unique = [...new Set(userIds)];
  await Promise.all(
    unique.map((userId) => dispatchNotification(admin, { ...input, userId })),
  );
}
