import { NextResponse } from "next/server";
import { Text } from "@react-email/components";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";
import { EMAIL_FROM } from "@/lib/email/constants";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { sendEmail } from "@/lib/email/resend-client";
import { buildPreferencesUrl, buildUnsubscribeUrl, buildViewInBrowserUrl } from "@/lib/email/signing";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const status = new URL(request.url).searchParams.get("status");

  let query = auth.admin.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(200);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "viewed_support",
    ipAddress: getClientIp(request),
    metadata: { status, count: data?.length ?? 0 },
  });

  return NextResponse.json({ tickets: data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const body = await request.json();
  const id = body.id as string | undefined;
  const status = body.status as string | undefined;
  const responseText = (body.response as string | undefined)?.trim();

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data: ticket } = await auth.admin.from("support_tickets").select("*").eq("id", id).maybeSingle();
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;

  if (responseText) {
    updates.response = responseText;
    updates.responded_at = new Date().toISOString();
    updates.assigned_to = auth.email;

    const to = ticket.from_email as string;
    const subject = ticket.subject ? `Re: ${ticket.subject}` : "Re: Your message to Sif's Gold";

    await sendEmail({
      to,
      subject,
      from: EMAIL_FROM.notifications,
      replyTo: EMAIL_FROM.replyTo,
      react: (
        <EmailLayout
          preview="Response from Sif's Gold support"
          recipientEmail={to}
          viewInBrowserUrl={buildViewInBrowserUrl(to, "contact_form_confirmation")}
          unsubscribeUrl={buildUnsubscribeUrl(to)}
          preferencesUrl={buildPreferencesUrl(to)}
        >
          <Text style={{ fontSize: 16, lineHeight: "24px", color: "#F5EFE0" }}>Hi,</Text>
          {responseText.split("\n").map((line, index) => (
            <Text key={`${index}-${line.slice(0, 8)}`} style={{ fontSize: 16, lineHeight: "24px", color: "#F5EFE0" }}>
              {line || " "}
            </Text>
          ))}
          <Text style={{ fontSize: 16, lineHeight: "24px", color: "#F5EFE0", marginTop: 16 }}>
            — The Sif&apos;s Gold team
          </Text>
        </EmailLayout>
      ),
    });
  }

  const { error } = await auth.admin.from("support_tickets").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: responseText ? "responded_support_ticket" : "updated_support_ticket",
    targetId: id,
    ipAddress: getClientIp(request),
    metadata: { status, hasResponse: Boolean(responseText) },
  });

  return NextResponse.json({ ok: true });
}
