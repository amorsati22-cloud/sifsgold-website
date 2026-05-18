import { NextResponse } from "next/server";
import { Text } from "@react-email/components";
import { createReferralInvite } from "@/lib/loyalty/referral-engine";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";
import { isResendConfigured, sendEmail } from "@/lib/email/resend-client";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://sifsgold.com";

type Body = { email: string; membership_id?: string };

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Body;
  if (!body.email?.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let query = admin
    .from("loyalty_memberships")
    .select("id, referral_code, program:loyalty_programs(name)")
    .eq("member_id", user.id);

  if (body.membership_id) query = query.eq("id", body.membership_id);

  const { data: m } = await query.limit(1).maybeSingle();
  if (!m) return NextResponse.json({ error: "Join a loyalty program first" }, { status: 400 });

  const programName = (m.program as { name: string })?.name ?? "Sif's Gold";
  const link = `${SITE_URL}/sign-up?ref=${m.referral_code}`;

  const created = await createReferralInvite(admin, {
    referrerMembershipId: m.id as string,
    email: body.email,
    referralCode: m.referral_code as string,
  });

  if (created.error) return NextResponse.json({ error: created.error }, { status: 400 });

  if (isResendConfigured()) {
    await sendEmail({
      to: body.email,
      subject: `Join ${programName} on Sif's Gold`,
      react: (
        <EmailLayout
          preview="You are invited"
          recipientEmail={body.email}
          viewInBrowserUrl={link}
          unsubscribeUrl={`${SITE_URL}/legal/privacy`}
          preferencesUrl={`${SITE_URL}/account`}
        >
          <Text style={emailStyles.p}>
            You have been invited to {programName}. Use code <strong>{m.referral_code as string}</strong> when you sign up.
          </Text>
          <Text style={emailStyles.p}>
            <a href={link} style={emailStyles.link}>
              Accept invitation
            </a>
          </Text>
        </EmailLayout>
      ),
    });
  }

  return NextResponse.json({ ok: true, referral: created.referral, link });
}
