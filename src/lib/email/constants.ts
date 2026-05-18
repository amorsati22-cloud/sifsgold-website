import { BRAND } from "@/lib/constants";
import { sifsGoldTheme } from "@/lib/theme";

export const EMAIL_BRAND = {
  name: BRAND.name,
  url: BRAND.url,
  colors: {
    navy: sifsGoldTheme.colors.navy,
    navyDeep: sifsGoldTheme.colors.navyDeep,
    cream: sifsGoldTheme.colors.cream,
    gold: sifsGoldTheme.colors.gold,
    goldBody: sifsGoldTheme.colors.goldBody,
    teal: sifsGoldTheme.colors.teal,
  },
  fonts: {
    headline: "'Playfair Display', Georgia, serif",
    body: "'Montserrat', Arial, sans-serif",
  },
  mailingAddress: "202 N Cedar Ave Ste 1, Owatonna, MN 55060",
} as const;

export const EMAIL_FROM = {
  default: process.env.RESEND_FROM_EMAIL ?? "hello@sifsgold.com",
  notifications: process.env.RESEND_NOTIFICATIONS_FROM ?? "notifications@sifsgold.com",
  replyTo: process.env.RESEND_REPLY_TO ?? "hello@sifsgold.com",
} as const;
