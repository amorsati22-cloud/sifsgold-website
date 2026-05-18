import { NextResponse } from "next/server";
import { requireAdvocate, requireBrandPartner } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  const brand = await requireBrandPartner();
  const admin = createAdminClient();

  const supabase = brand.authorized ? brand.supabase : admin;
  if (!supabase) return NextResponse.json({ applications: [] });

  if (brand.authorized) {
    const { data: campaign } = await supabase
      .from("brand_campaigns")
      .select("id")
      .eq("id", params.id)
      .eq("brand_partner_id", brand.user!.id)
      .single();
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("campaign_applications")
    .select("*, advocate:advocate_profiles(display_name, specialties, follower_count, instagram_handle)")
    .eq("campaign_id", params.id)
    .order("applied_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data ?? [] });
}

export async function POST(request: Request, { params }: Params) {
  const advocate = await requireAdvocate();
  if (!advocate.authorized || !advocate.supabase) {
    const suspended = "suspended" in advocate && advocate.suspended;
    return NextResponse.json(
      { error: suspended ? "Marketplace access suspended (FTC strikes)" : "Advocate access required" },
      { status: 403 },
    );
  }

  const body = await request.json();

  const { data: campaign } = await advocate.supabase
    .from("brand_campaigns")
    .select("id, status, escrow_funded, application_deadline")
    .eq("id", params.id)
    .eq("status", "published")
    .eq("escrow_funded", true)
    .single();

  if (!campaign) return NextResponse.json({ error: "Campaign not available" }, { status: 404 });

  const { data, error } = await advocate.supabase
    .from("campaign_applications")
    .insert({
      campaign_id: params.id,
      advocate_id: advocate.user!.id,
      pitch: body.pitch,
      portfolio_samples: body.portfolio_samples ?? [],
      proposed_timeline: body.proposed_timeline,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ application: data });
}
