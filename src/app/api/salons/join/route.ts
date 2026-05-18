import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.redirect(new URL("/sign-in", request.url));

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));

  const form = await request.formData();
  const token = form.get("token") as string;
  if (!token) return NextResponse.redirect(new URL("/salon/join", request.url));

  const admin = createAdminClient() ?? supabase;

  const { data: invite } = await admin
    .from("salon_staff_invites")
    .select("*")
    .eq("token", token)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!invite) {
    return NextResponse.redirect(new URL("/salon/join?error=invalid", request.url));
  }

  await admin.from("salon_staff").upsert(
    {
      salon_id: invite.salon_id,
      pro_id: user.id,
      role: invite.role,
      commission_split: invite.commission_split,
      status: "active",
      start_date: new Date().toISOString().slice(0, 10),
    },
    { onConflict: "salon_id,pro_id" },
  );

  await admin
    .from("salon_staff_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  return NextResponse.redirect(new URL("/dashboard/pro/home", request.url));
}
