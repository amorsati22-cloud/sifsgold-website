import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";
import { resolveCampaignRecipients, type CampaignSegment } from "@/lib/admin/campaigns";
import { sendTemplateEmail } from "@/lib/email/send-template";
import type { EmailTemplateType } from "@/lib/email/types";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const { data, error } = await auth.admin
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const body = await request.json();
  const templateKey = body.template_key as EmailTemplateType;
  const segment = body.segment as CampaignSegment;
  const testOnly = Boolean(body.test_only);
  const customFilter = body.custom_filter as Record<string, unknown> | null;

  if (!templateKey || !segment) {
    return NextResponse.json({ error: "template_key and segment required" }, { status: 400 });
  }

  const recipients = testOnly
    ? [auth.email]
    : await resolveCampaignRecipients(auth.admin, segment, customFilter);

  if (!recipients.length) {
    return NextResponse.json({ error: "No recipients in segment" }, { status: 400 });
  }

  const { data: campaign, error: insertError } = await auth.admin
    .from("email_campaigns")
    .insert({
      sent_by_email: auth.email,
      template_key: templateKey,
      segment,
      custom_filter: customFilter,
      recipient_count: recipients.length,
      status: "sending",
    })
    .select("id")
    .single();

  if (insertError || !campaign) {
    return NextResponse.json({ error: insertError?.message ?? "Could not create campaign" }, { status: 500 });
  }

  let successful = 0;
  let failed = 0;

  for (const email of recipients) {
    try {
      const outcome = await sendTemplateEmail(templateKey, email, { name: email });
      if (outcome.skipped) failed += 1;
      else successful += 1;
    } catch {
      failed += 1;
    }
  }

  await auth.admin
    .from("email_campaigns")
    .update({
      status: failed === recipients.length ? "failed" : "sent",
      sent_at: new Date().toISOString(),
      successful_sends: successful,
      failed_sends: failed,
    })
    .eq("id", campaign.id);

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: testOnly ? "sent_campaign_test" : "sent_campaign",
    targetId: campaign.id as string,
    ipAddress: getClientIp(request),
    metadata: { templateKey, segment, recipient_count: recipients.length, successful, failed, testOnly },
  });

  return NextResponse.json({
    ok: true,
    campaign_id: campaign.id,
    recipient_count: recipients.length,
    successful,
    failed,
  });
}
