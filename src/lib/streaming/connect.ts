import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/** Resolve Stripe Connect account for a streamer profile. */
export async function getStreamerConnectAccount(profileId: string): Promise<{
  accountId: string | null;
  onboarded: boolean;
}> {
  const admin = createAdminClient();
  if (!admin) return { accountId: null, onboarded: false };

  const { data: pro } = await admin
    .from("pro_profiles")
    .select("stripe_connect_account_id, stripe_connect_onboarded")
    .eq("id", profileId)
    .maybeSingle();

  if (pro?.stripe_connect_account_id) {
    return {
      accountId: pro.stripe_connect_account_id as string,
      onboarded: Boolean(pro.stripe_connect_onboarded),
    };
  }

  const { data: advocate } = await admin
    .from("advocate_profiles")
    .select("stripe_connect_account_id, stripe_connect_onboarded")
    .eq("id", profileId)
    .maybeSingle();

  if (advocate?.stripe_connect_account_id) {
    return {
      accountId: advocate.stripe_connect_account_id as string,
      onboarded: Boolean(advocate.stripe_connect_onboarded),
    };
  }

  return { accountId: null, onboarded: false };
}
