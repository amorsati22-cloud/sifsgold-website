import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSiteUrl } from "@/lib/auth/site-url";
import { getStripe } from "@/lib/stripe";

export async function ensureConnectOnboardingLink(
  admin: SupabaseClient,
  advocateId: string,
  email: string,
  displayName: string,
): Promise<{ url: string; accountId: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured" };

  const { data: profile } = await admin
    .from("advocate_profiles")
    .select("stripe_connect_account_id, stripe_connect_onboarded")
    .eq("id", advocateId)
    .maybeSingle();

  let accountId = profile?.stripe_connect_account_id as string | undefined;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: {
        transfers: { requested: true },
      },
      business_profile: {
        product_description: "Sif's Advocate — brand partnerships on Sif's Gold",
      },
      metadata: { advocate_id: advocateId },
    });
    accountId = account.id;
    await admin
      .from("advocate_profiles")
      .update({ stripe_connect_account_id: accountId })
      .eq("id", advocateId);
  }

  const siteUrl = getSiteUrl();
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteUrl}/dashboard/advocate/onboarding?step=2&refresh=1`,
    return_url: `${siteUrl}/dashboard/advocate/onboarding?step=3&connect=done`,
    type: "account_onboarding",
  });

  return { url: link.url, accountId };
}

export async function refreshConnectOnboardedStatus(
  admin: SupabaseClient,
  advocateId: string,
): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;

  const { data: profile } = await admin
    .from("advocate_profiles")
    .select("stripe_connect_account_id")
    .eq("id", advocateId)
    .maybeSingle();

  const accountId = profile?.stripe_connect_account_id as string | undefined;
  if (!accountId) return false;

  const account = await stripe.accounts.retrieve(accountId);
  const onboarded = Boolean(account.details_submitted && account.charges_enabled);

  if (onboarded) {
    await admin
      .from("advocate_profiles")
      .update({ stripe_connect_onboarded: true })
      .eq("id", advocateId);
  }

  return onboarded;
}
