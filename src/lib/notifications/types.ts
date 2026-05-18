export const NOTIFICATION_CATEGORIES = [
  "booking",
  "message",
  "payment",
  "marketing",
  "system",
  "loyalty",
  "brand_deal",
  "review",
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export type CategoryChannelPrefs = {
  in_app?: boolean;
  push?: boolean;
  email?: boolean;
};

export type CategoryPrefsMap = Partial<Record<NotificationCategory, CategoryChannelPrefs>>;

export type DigestFrequency = "never" | "daily" | "weekly";

export type NotificationPreferences = {
  id: string;
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  categories: CategoryPrefsMap;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  digest_frequency: DigestFrequency;
  digest_last_sent_at: string | null;
};

export type DispatchInput = {
  userId: string;
  category: NotificationCategory;
  type: string;
  title: string;
  body?: string;
  iconUrl?: string;
  actionUrl?: string;
  expiresAt?: string;
  /** Bypass quiet hours for push (booking reminders, security, etc.) */
  urgent?: boolean;
  /** Skip immediate email; notification stays in-app for digest */
  digestOnly?: boolean;
};

export const DEFAULT_CATEGORY_PREFS: Record<NotificationCategory, CategoryChannelPrefs> = {
  booking: { in_app: true, push: true, email: true },
  message: { in_app: true, push: true, email: true },
  payment: { in_app: true, push: true, email: true },
  marketing: { in_app: true, push: false, email: false },
  system: { in_app: true, push: true, email: true },
  loyalty: { in_app: true, push: true, email: true },
  brand_deal: { in_app: true, push: true, email: true },
  review: { in_app: true, push: true, email: true },
};
