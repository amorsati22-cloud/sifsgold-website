import { NextResponse } from "next/server";
import { requireSalonDashboardUser } from "@/lib/salons/require-salon";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Ctx = { params: { salon_id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const { salon, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data } = await supabase
    .from("salon_staff")
    .select("*, pro_profiles(display_name, username, avatar_url)")
    .eq("salon_id", salon.id);

  return NextResponse.json({ staff: data ?? [] });
}

export async function POST(request: Request, { params }: Ctx) {
  const { salon, user, supabase } = await requireSalonDashboardUser();
  if (salon.id !== params.salon_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const admin = createAdminClient() ?? supabase;
  const { data: invite, error } = await admin
    .from("salon_staff_invites")
    .insert({
      salon_id: salon.id,
      email,
      role: body.role ?? "pro",
      commission_split: body.commission_split ?? 60,
      invited_by: user.id,
    })
    .select("id, token, expires_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/salon/join?token=${invite.token}`;

  return NextResponse.json({ invite, invite_url: inviteUrl });
}
