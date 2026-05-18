import { NextResponse } from "next/server";
import { DEFAULT_FTC_DISCLOSURE_TEMPLATE } from "@/lib/brand-deals/constants";
import { getSessionProfile, requireBrandPartner } from "@/lib/brand-deals/auth-helpers";
import { isAdvocateUserType } from "@/lib/auth-advocate";
import { isBrandUserType } from "@/lib/auth-brand";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** List brand campaigns (marketplace). Maps spec `brand_deals` → `brand_campaigns`. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "published";
  const minPay = searchParams.get("min_pay");
  const objective = searchParams.get("objective");
  const specialty = searchParams.get("specialty");

  const session = await getSessionProfile();
  const admin = createAdminClient();
  const supabase = session.supabase ?? admin;
  if (!supabase) return NextResponse.json({ deals: [] });

  const userType = session.profile?.user_type;
  const canBrowse =
    isAdvocateUserType(userType) ||
    isBrandUserType(userType) ||
    status === "published";

  if (!canBrowse) {
    return NextResponse.json({ error: "Sign in as advocate or brand partner" }, { status: 401 });
  }

  let query = supabase.from("brand_campaigns").select("*").order("published_at", { ascending: false });

  if (isBrandUserType(userType) && searchParams.get("mine") === "1") {
    query = query.eq("brand_partner_id", session.user!.id);
  } else if (status === "published") {
    query = query.eq("status", "published").eq("escrow_funded", true);
  } else {
    query = query.eq("status", status);
  }

  if (objective) query = query.eq("objective", objective);
  if (minPay) query = query.gte("per_advocate_compensation", Number(minPay));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let deals = data ?? [];
  if (specialty && isAdvocateUserType(userType)) {
    const tag = specialty.toLowerCase();
    deals = deals.filter((d) => {
      const targets = (d.target_advocate_specialties as string[] | null) ?? [];
      return targets.length === 0 || targets.some((t) => t.toLowerCase().includes(tag));
    });
  }

  return NextResponse.json({ deals });
}

export async function POST(request: Request) {
  const brand = await requireBrandPartner();
  if (!brand.authorized || !brand.supabase) {
    return NextResponse.json({ error: "Gold Partner access required" }, { status: 403 });
  }

  const body = await request.json();

  const { data, error } = await brand.supabase
    .from("brand_campaigns")
    .insert({
      brand_partner_id: brand.user!.id,
      title: body.title,
      description: body.description,
      objective: body.objective ?? "awareness",
      campaign_type: body.campaign_type ?? "sponsored_post",
      total_budget: body.total_budget,
      max_advocates: body.max_advocates ?? 1,
      per_advocate_compensation: body.compensation_amount ?? body.per_advocate_compensation,
      compensation_type: body.compensation_type ?? "flat_fee",
      deliverables: body.deliverables ?? [],
      platforms_required: body.platforms ?? body.platforms_required ?? [],
      application_deadline: body.application_deadline,
      delivery_deadline: body.delivery_deadline,
      target_advocate_specialties: body.target_advocate_specialties ?? [],
      ftc_disclosure_template: body.ftc_disclosure_template ?? DEFAULT_FTC_DISCLOSURE_TEMPLATE,
      status: body.status ?? "draft",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deal: data });
}
