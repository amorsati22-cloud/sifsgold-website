import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";
import {
  createAdvocateProfileFromApplication,
  findProfileIdByEmail,
} from "@/lib/advocates/profile";
import { getSiteUrl } from "@/lib/auth/site-url";
import { sendTemplateEmail } from "@/lib/email/send-template";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const status = new URL(request.url).searchParams.get("status") ?? "pending";

  const { data, error } = await auth.admin
    .from("advocate_applications")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "viewed_advocates",
    ipAddress: getClientIp(request),
    metadata: { status, count: data?.length ?? 0 },
  });

  return NextResponse.json({ applications: data ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const body = await request.json();
  const id = body.id as string | undefined;
  const action = body.action as "approve" | "reject" | "waitlist" | undefined;
  const reviewerNotes = (body.reviewer_notes as string | undefined)?.trim() || null;

  if (!id || !action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  const { data: app, error: fetchError } = await auth.admin
    .from("advocate_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const siteUrl = getSiteUrl();
  let newStatus: string;
  let auditAction: "approved_advocate" | "rejected_advocate" | "waitlisted_advocate";

  if (action === "approve") {
    newStatus = "approved";
    auditAction = "approved_advocate";

    const userId = await findProfileIdByEmail(auth.admin, app.email as string);
    if (userId) {
      await createAdvocateProfileFromApplication(auth.admin, {
        userId,
        applicationId: id,
        email: app.email as string,
        fullName: app.full_name as string,
        specialty: app.specialty as string | null,
        socialHandles: app.social_handles as string | null,
        sampleUrls: (app.sample_content_urls as string[] | null) ?? [],
      });
      await auth.admin.from("profiles").update({ user_type: "sifs_advocate" }).eq("id", userId);
    } else {
      await auth.admin
        .from("profiles")
        .update({ user_type: "sifs_advocate" })
        .ilike("email", app.email as string);
    }

    await sendTemplateEmail("sifs_advocate_acceptance", app.email as string, {
      name: app.full_name as string,
      tier: "Gold Advocate",
      dashboardUrl: `${siteUrl}/dashboard/advocate/onboarding`,
      agreementUrl: `${siteUrl}/legal/sifs-advocate-agreement.pdf`,
    });
  } else if (action === "reject") {
    newStatus = "rejected";
    auditAction = "rejected_advocate";
    await sendTemplateEmail("sifs_advocate_rejection", app.email as string, {
      name: app.full_name as string,
    });
  } else {
    newStatus = "waitlist";
    auditAction = "waitlisted_advocate";
  }

  const { error: updateError } = await auth.admin
    .from("advocate_applications")
    .update({
      status: newStatus,
      reviewed_at: new Date().toISOString(),
      reviewer_notes: reviewerNotes,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: auditAction,
    targetId: id,
    ipAddress: getClientIp(request),
    metadata: { email: app.email, reviewerNotes },
  });

  return NextResponse.json({ ok: true, status: newStatus });
}
