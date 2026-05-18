import { NextResponse } from "next/server";
import { clientIp } from "@/lib/brand-deals/format";
import { getSessionProfile } from "@/lib/brand-deals/auth-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function POST(request: Request, { params }: Params) {
  const { supabase, user, profile } = await getSessionProfile();
  const admin = createAdminClient();
  if (!supabase || !user || !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { role: "brand" | "advocate" };
  const ip = clientIp(request);

  const { data: contract } = await admin
    .from("campaign_contracts")
    .select("*, campaign:brand_campaigns(brand_partner_id)")
    .eq("id", params.id)
    .single();

  if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });

  const brandId = (contract.campaign as { brand_partner_id: string }).brand_partner_id;

  if (body.role === "brand" && user.id !== brandId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (body.role === "advocate" && user.id !== contract.advocate_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates =
    body.role === "brand"
      ? { signed_by_brand: true, brand_signed_at: new Date().toISOString(), brand_signed_ip: ip }
      : { signed_by_advocate: true, advocate_signed_at: new Date().toISOString(), advocate_signed_ip: ip };

  const { data: updated } = await admin
    .from("campaign_contracts")
    .update(updates)
    .eq("id", params.id)
    .select("*")
    .single();

  if (updated?.signed_by_brand && updated.signed_by_advocate) {
    await admin.from("campaign_contracts").update({ status: "active" }).eq("id", params.id);
  }

  return NextResponse.json({ contract: updated });
}
