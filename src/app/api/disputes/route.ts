import { NextResponse } from "next/server";
import { getSessionProfile, isAdminUser } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const { user } = await getSessionProfile();
  if (!user || !isAdminUser(user.id)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ disputes: [] });

  const { data } = await admin
    .from("campaign_disputes")
    .select("*")
    .in("status", ["open", "under_review"])
    .order("created_at", { ascending: false });

  return NextResponse.json({ disputes: data ?? [] });
}

export async function POST(request: Request) {
  const { supabase, user } = await getSessionProfile();
  if (!supabase || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data, error } = await supabase
    .from("campaign_disputes")
    .insert({
      campaign_id: body.campaign_id,
      contract_id: body.contract_id,
      raised_by_type: body.raised_by_type,
      raised_by_id: user.id,
      reason: body.reason,
      description: body.description,
      evidence: body.evidence ?? {},
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase
    .from("campaign_contracts")
    .update({ status: "disputed" })
    .eq("id", body.contract_id);

  return NextResponse.json({ dispute: data });
}

export async function PATCH(request: Request) {
  const { user } = await getSessionProfile();
  if (!user || !isAdminUser(user.id)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const body = (await request.json()) as {
    dispute_id: string;
    status: string;
    admin_notes?: string;
    resolution?: string;
  };

  const { data, error } = await admin
    .from("campaign_disputes")
    .update({
      status: body.status,
      admin_notes: body.admin_notes,
      resolution: body.resolution,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", body.dispute_id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispute: data });
}
