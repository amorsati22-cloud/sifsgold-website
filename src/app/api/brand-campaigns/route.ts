import { NextResponse } from "next/server";
import { DEFAULT_FTC_DISCLOSURE_TEMPLATE } from "@/lib/brand-deals/constants";
import { requireBrandPartner } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const brand = await requireBrandPartner();

  const supabase = brand.supabase;
  if (!supabase) return NextResponse.json({ campaigns: [] });

  let query = supabase.from("brand_campaigns").select("*").order("created_at", { ascending: false });

  if (brand.authorized) {
    query = query.eq("brand_partner_id", brand.user!.id);
  } else if (status === "published") {
    query = query.eq("status", "published").eq("escrow_funded", true);
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (status && brand.authorized) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data ?? [] });
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
      objective: body.objective,
      campaign_type: body.campaign_type,
      total_budget: body.total_budget,
      max_advocates: body.max_advocates,
      per_advocate_compensation: body.per_advocate_compensation,
      compensation_type: body.compensation_type,
      product_value: body.product_value,
      commission_percent: body.commission_percent,
      deliverables: body.deliverables ?? [],
      platforms_required: body.platforms_required ?? [],
      application_deadline: body.application_deadline,
      delivery_deadline: body.delivery_deadline,
      payment_terms: body.payment_terms ?? "on_delivery",
      target_advocate_specialties: body.target_advocate_specialties ?? [],
      target_advocate_min_followers: body.target_advocate_min_followers,
      target_advocate_locations: body.target_advocate_locations ?? [],
      ftc_disclosure_template: body.ftc_disclosure_template ?? DEFAULT_FTC_DISCLOSURE_TEMPLATE,
      exclusivity_clause: body.exclusivity_clause ?? "none",
      usage_rights: body.usage_rights ?? "organic_only",
      status: "draft",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaign: data });
}
