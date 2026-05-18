import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { FTC_MAX_STRIKES } from "@/lib/brand-deals/constants";
import { getSiteUrl } from "@/lib/auth/site-url";
import { sendTemplateEmail } from "@/lib/email/send-template";

export async function recordAdminFtcStrike(
  admin: SupabaseClient,
  params: {
    advocateId: string;
    reason: string;
    brandDealId?: string | null;
    reviewerEmail: string;
    deliverableId?: string | null;
  },
): Promise<{ strikeCount: number; suspended: boolean }> {
  await admin.from("advocate_ftc_strikes").insert({
    advocate_id: params.advocateId,
    deliverable_id: params.deliverableId ?? null,
    reason: params.reason,
  });

  const { data: profile } = await admin
    .from("advocate_profiles")
    .select("ftc_strike_count, ftc_strike_dates, marketplace_suspended")
    .eq("id", params.advocateId)
    .single();

  const strikeCount = (profile?.ftc_strike_count ?? 0) + 1;
  const strikeDates = [...((profile?.ftc_strike_dates as string[] | null) ?? []), new Date().toISOString()];
  const suspended = strikeCount >= FTC_MAX_STRIKES;

  await admin
    .from("advocate_profiles")
    .update({
      ftc_strike_count: strikeCount,
      ftc_strike_dates: strikeDates,
      marketplace_suspended: suspended,
      status: suspended ? "suspended" : "active",
    })
    .eq("id", params.advocateId);

  if (params.brandDealId) {
    await admin.from("ftc_disclosures").insert({
      advocate_id: params.advocateId,
      brand_deal_id: params.brandDealId,
      platform: "sifs_gold",
      disclosure_text: "Admin-recorded FTC violation",
      compliance_status: "non_compliant",
      reviewed_at: new Date().toISOString(),
      reviewer_email: params.reviewerEmail,
    });
  }

  const { data: userProfile } = await admin
    .from("profiles")
    .select("email")
    .eq("id", params.advocateId)
    .maybeSingle();

  const email = userProfile?.email as string | undefined;
  const siteUrl = getSiteUrl();

  if (email) {
    if (suspended) {
      await sendTemplateEmail("advocate_suspended", email, {});
    } else {
      await sendTemplateEmail("ftc_strike_warning", email, {
        strikeCount,
        maxStrikes: FTC_MAX_STRIKES,
        dashboardUrl: `${siteUrl}/dashboard/advocate`,
      });
    }
  }

  return { strikeCount, suspended };
}
