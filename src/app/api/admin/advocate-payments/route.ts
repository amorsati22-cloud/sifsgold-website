import { NextResponse } from "next/server";
import { getClientIp, logAdminAudit } from "@/lib/admin/audit";
import { isAdminApiResult, requireAdminApi } from "@/lib/admin/auth";
import { recordAdvocateEarning } from "@/lib/advocates/earnings";
import { getSiteUrl } from "@/lib/auth/site-url";
import { splitCompensation } from "@/lib/brand-deals/payout-engine";
import { sendTemplateEmail } from "@/lib/email/send-template";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!isAdminApiResult(auth)) return auth;

  const body = await request.json();
  const advocateId = body.advocate_id as string | undefined;
  const grossAmount = Number(body.gross_amount);
  const sourceId = (body.source_id as string | undefined) ?? null;
  const dealTitle = (body.deal_title as string | undefined) ?? "Brand deal";
  const applicationId = body.application_id as string | undefined;

  if (!advocateId || !grossAmount || Number.isNaN(grossAmount)) {
    return NextResponse.json({ error: "advocate_id and gross_amount required" }, { status: 400 });
  }

  const { data: advocate } = await auth.admin
    .from("advocate_profiles")
    .select("stripe_connect_account_id, stripe_connect_onboarded, display_name")
    .eq("id", advocateId)
    .single();

  if (!advocate?.stripe_connect_onboarded || !advocate.stripe_connect_account_id) {
    return NextResponse.json({ error: "Advocate Stripe Connect not complete" }, { status: 400 });
  }

  const { netToAdvocate } = splitCompensation(grossAmount);
  const stripe = getStripe();
  let stripeTransferId: string | null = null;

  if (stripe && netToAdvocate > 0) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(netToAdvocate * 100),
        currency: "usd",
        destination: advocate.stripe_connect_account_id as string,
        metadata: {
          advocate_id: advocateId,
          source_id: sourceId ?? "",
        },
      });
      stripeTransferId = transfer.id;
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Stripe transfer failed" },
        { status: 502 },
      );
    }
  }

  const earning = await recordAdvocateEarning(auth.admin, {
    advocateId,
    sourceType: "brand_deal",
    sourceId,
    grossAmount,
    status: stripeTransferId ? "paid" : "processing",
    stripeTransferId,
  });

  if (applicationId) {
    await auth.admin
      .from("campaign_applications")
      .update({ status: "completed", payment_status: stripeTransferId ? "paid" : "processing" })
      .eq("id", applicationId);
  }

  const { data: profile } = await auth.admin.from("profiles").select("email").eq("id", advocateId).single();

  if (profile?.email) {
    await sendTemplateEmail("advocate_payment_sent", profile.email as string, {
      amount: `$${netToAdvocate.toFixed(2)}`,
      dealTitle,
      dashboardUrl: `${getSiteUrl()}/dashboard/advocate/earnings`,
    });
  }

  await logAdminAudit({
    admin: auth.admin,
    adminEmail: auth.email,
    action: "advocate_payout",
    targetId: advocateId,
    ipAddress: getClientIp(request),
    metadata: { grossAmount, netToAdvocate, stripeTransferId, earningId: earning.earningId },
  });

  return NextResponse.json({ ok: true, ...earning, stripeTransferId });
}
