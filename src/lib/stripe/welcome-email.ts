import "server-only";

import type { PricingTier } from "@/data/pricing";

export async function sendSubscriptionWelcomeEmail(
  to: string,
  tier?: PricingTier | null,
): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifsgold.com";
  const token = process.env.EMAIL_TRIGGER_TOKEN?.trim();
  if (!token) {
    console.info("[stripe] welcome email skipped — EMAIL_TRIGGER_TOKEN not set");
    return;
  }

  try {
    await fetch(`${siteUrl}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-email-trigger-token": token,
      },
      body: JSON.stringify({
        type: "welcome_sifs_circle",
        to,
        data: tier ? { tier: tier.name } : undefined,
      }),
    });
  } catch (error) {
    console.error("[stripe] welcome email failed", error);
  }
}
