import { NextResponse } from "next/server";
import { DEFAULT_FTC_DISCLOSURE_TEMPLATE } from "@/lib/brand-deals/constants";
import { verifyFtcDisclosureOnUrl } from "@/lib/brand-deals/ftc-verification";
import { getSessionProfile } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function POST(request: Request, { params }: Params) {
  const { user } = await getSessionProfile();
  const admin = createAdminClient();
  if (!user || !admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    deliverable_id: string;
    submitted_url: string;
    notes?: string;
  };

  const { data: contract } = await admin
    .from("campaign_contracts")
    .select("advocate_id, campaign:brand_campaigns(ftc_disclosure_template, brand_partner_id)")
    .eq("id", params.id)
    .single();

  if (!contract || contract.advocate_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ftcTemplate =
    (contract.campaign as { ftc_disclosure_template?: string }).ftc_disclosure_template ??
    DEFAULT_FTC_DISCLOSURE_TEMPLATE;

  const verification = await verifyFtcDisclosureOnUrl(body.submitted_url, ftcTemplate);

  const { data: deliverable, error } = await admin
    .from("campaign_deliverables")
    .update({
      submitted_url: body.submitted_url,
      submitted_at: new Date().toISOString(),
      ftc_disclosure_text: ftcTemplate,
      ftc_compliance_verified: verification.compliant,
      status: verification.compliant ? "under_review" : "submitted",
    })
    .eq("id", body.deliverable_id)
    .eq("contract_id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!verification.compliant) {
    const { recordFtcStrikeIfNeeded } = await import("@/lib/brand-deals/ftc-verification");
    await recordFtcStrikeIfNeeded(
      admin,
      contract.advocate_id,
      body.deliverable_id,
      "Missing FTC disclosure on submitted post",
    );
  }

  return NextResponse.json({ deliverable, verification });
}
