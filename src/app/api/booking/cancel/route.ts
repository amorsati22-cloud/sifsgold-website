import { NextResponse } from "next/server";
import { evaluateCancellation, refundAmount } from "@/lib/booking/cancellation";
import { logStatusChange } from "@/lib/booking/appointments";
import { sendAppointmentCancelledEmails } from "@/lib/booking/notifications";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  appointment_id: string;
  reason?: string;
  cancelled_by?: "client" | "pro";
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const { data: appointment } = await admin
    .from("appointments")
    .select("*, services(cancellation_policy, name), pro_profiles(username, display_name)")
    .eq("id", body.appointment_id)
    .maybeSingle();

  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const cancelledBy = body.cancelled_by ?? "client";
  const isPro = user?.id === appointment.pro_id;
  const isClient =
    user?.id === appointment.client_id ||
    appointment.guest_email === user?.email;

  if (cancelledBy === "client" && !isClient && !isPro) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (cancelledBy === "pro" && !isPro) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const service = appointment.services as { cancellation_policy: string | null; name: string } | null;
  const eligibility = evaluateCancellation(
    service?.cancellation_policy,
    appointment.scheduled_start as string,
  );

  if (cancelledBy === "client" && !eligibility.canCancel && !isPro) {
    return NextResponse.json({ error: eligibility.message }, { status: 400 });
  }

  const newStatus = cancelledBy === "pro" ? "cancelled_by_pro" : "cancelled_by_client";
  let refundNote: string | undefined;

  const depositPaid = Boolean(appointment.deposit_paid);
  const depositAmount = Number(appointment.deposit_amount);
  const refund = refundAmount(depositPaid, depositAmount, eligibility.refundPercent);
  const piId = appointment.deposit_stripe_payment_intent_id as string | null;

  if (refund > 0 && piId) {
    const stripe = getStripe();
    if (stripe) {
      await stripe.refunds.create({ payment_intent: piId, amount: Math.round(refund * 100) });
      refundNote = `A refund of $${refund.toFixed(2)} has been initiated to your card.`;
    }
  } else if (depositPaid && refund === 0) {
    refundNote = "Per the cancellation policy, the deposit is non-refundable.";
  }

  await admin
    .from("appointments")
    .update({
      status: newStatus,
      cancellation_reason: body.reason ?? null,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", appointment.id);

  await logStatusChange({
    appointmentId: appointment.id as string,
    previousStatus: appointment.status as string,
    newStatus,
    changedBy: user?.id ?? null,
    note: body.reason,
  });

  const pro = appointment.pro_profiles as { username: string; display_name: string };
  const clientEmail =
    (appointment.guest_email as string) ||
    (user?.email ?? "");

  if (clientEmail) {
    await sendAppointmentCancelledEmails({
      ctx: {
        appointmentId: appointment.id as string,
        clientName: (appointment.guest_name as string) ?? "Guest",
        clientEmail,
        proId: appointment.pro_id as string,
        proName: pro?.display_name ?? "Professional",
        proUsername: pro?.username ?? "",
        serviceName: service?.name ?? "Appointment",
        scheduledStart: appointment.scheduled_start as string,
        scheduledEnd: appointment.scheduled_end as string,
        timezone: appointment.timezone as string,
      },
      cancelledBy,
      refundNote,
      serviceId: appointment.service_id as string | undefined,
    });
  }

  return NextResponse.json({ status: newStatus, refund_amount: refund, message: eligibility.message });
}
