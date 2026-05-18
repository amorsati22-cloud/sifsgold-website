import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_CATEGORY_PREFS,
  type CategoryChannelPrefs,
  type CategoryPrefsMap,
  type NotificationCategory,
  type NotificationPreferences,
} from "@/lib/notifications/types";

export function mergeCategoryPrefs(raw: CategoryPrefsMap | null | undefined) {
  const merged = { ...DEFAULT_CATEGORY_PREFS };
  if (!raw || typeof raw !== "object") return merged;

  for (const key of Object.keys(raw) as NotificationCategory[]) {
    merged[key] = { ...merged[key], ...raw[key] };
  }
  return merged;
}

export function categoryAllows(
  prefs: NotificationPreferences,
  category: NotificationCategory,
  channel: keyof CategoryChannelPrefs,
): boolean {
  const cats = mergeCategoryPrefs(prefs.categories);
  const cat = cats[category];
  if (channel === "in_app") return cat.in_app !== false;
  if (channel === "push") return prefs.push_enabled && cat.push !== false;
  if (channel === "email") return prefs.email_enabled && cat.email !== false;
  return true;
}

export function isQuietHours(prefs: NotificationPreferences, now = new Date()): boolean {
  if (!prefs.quiet_hours_start || !prefs.quiet_hours_end) return false;

  const [sh, sm] = prefs.quiet_hours_start.split(":").map(Number);
  const [eh, em] = prefs.quiet_hours_end.split(":").map(Number);
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const start = sh * 60 + (sm || 0);
  const end = eh * 60 + (em || 0);

  if (start === end) return false;
  if (start < end) return minutes >= start && minutes < end;
  return minutes >= start || minutes < end;
}

export async function getOrCreatePreferences(
  admin: SupabaseClient,
  userId: string,
): Promise<NotificationPreferences> {
  const { data: existing } = await admin
    .from("notification_preferences")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    return {
      ...existing,
      categories: mergeCategoryPrefs(existing.categories as CategoryPrefsMap),
    } as NotificationPreferences;
  }

  const { data: created } = await admin
    .from("notification_preferences")
    .insert({ id: userId })
    .select("*")
    .single();

  return {
    ...(created ?? { id: userId }),
    categories: DEFAULT_CATEGORY_PREFS,
    push_enabled: false,
    email_enabled: true,
    sms_enabled: false,
    quiet_hours_start: null,
    quiet_hours_end: null,
    digest_frequency: "daily",
    digest_last_sent_at: null,
  } as NotificationPreferences;
}
