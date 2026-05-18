import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/auth/site-url";
import { requireAdvocate } from "@/lib/brand-deals/auth-helpers";
import { sendTemplateEmail } from "@/lib/email/send-template";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id: campaignId } = await params;
  const advocate = await requireAdvocate();

  if (!advocate.authorized || !advocate.user) {
    const suspended = "suspended" in advocate && advocate.suspended;
    return NextResponse.json(
      { error: suspended ? "Marketplace access suspended (FTC strikes)" : "Advocate access required" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { data: campaign } = await admin
    .from("brand_campaigns")
    .select("id, title, status, escrow_funded, brand_partner_id")
    .eq("id", campaignId)
    .eq("status", "published")
    .eq("escrow_funded", true)
    .single();

  if (!campaign) {
    return NextResponse.json({ error: "Deal not available" }, { status: 404 });
  }

  const { data: application, error } = await admin
    .from("campaign_applications")
    .insert({
      campaign_id: campaignId,
      advocate_id: advocate.user.id,
      pitch: body.pitch,
      portfolio_samples: body.portfolio_samples ?? [],
      proposed_timeline: body.proposed_timeline,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already applied" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: brandProfile } = await admin
    .from("profiles")
    .select("email, full_name, business_name")
    .eq("id", campaign.brand_partner_id)
    .maybeSingle();

  const siteUrl = getSiteUrl();
  if (brandProfile?.email) {
    await sendTemplateEmail("brand_deal_matched", brandProfile.email as string, {
      brandName: (brandProfile.business_name as string) ?? (brandProfile.full_name as string) ?? "Gold Partner",
      dealTitle: campaign.title as string,
      applicationUrl: `${siteUrl}/dashboard/brand-deals/${campaignId}`,
    });
  }

  return NextResponse.json({ application });
}
