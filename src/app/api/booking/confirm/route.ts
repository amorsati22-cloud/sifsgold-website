import { isAfter, parseISO } from "date-fns";
import { NextResponse } from "next/server";
import {
  hasSchedulingConflict,
  logStatusChange,
} from "@/lib/booking/appointments";
import { sendAppointmentConfirmedEmails } from "@/lib/booking/notifications";
import { notifyAppointmentConfirmed } from "@/lib/notifications/integrations";
import { createSessionForAppointment, videoCallLobbyUrl } from "@/lib/video-calls/booking-hook";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  appointment_id: string;
  reservation_token: string;
  payment_intent_id?: string | null;
  client_details: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
    vision_attachments?: string[];
    client_timezone?: string;
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json({ error: "Booking unavailable" }, { status: 503 });
  }

  const { data: appointment } = await admin
    .from("appointments")
    .select("*, services(name, service_type), pro_profiles(username, display_name, location_city, location_state)")
    .eq("id", body.appointment_id)
    .maybeSingle();

  if (!appointment || appointment.reservation_token !== body.reservation_token) {
    return NextResponse.json({ error: "Invalid reservation" }, { status: 403 });
  }

  const reservedUntil = appointment.reserved_until as string | null;
  if (reservedUntil && !isAfter(parseISO(reservedUntil), new Date())) {
    return NextResponse.json({ error: "Reservation expired — pick a new time" }, { status: 410 });
  }

  const depositAmount = Number(appointment.deposit_amount);
  const stripe = getStripe();

  if (depositAmount > 0) {
    if (!body.payment_intent_id || !stripe) {
      return NextResponse.json({ error: "Payment required" }, { status: 400 });
    }
    const intent = await stripe.paymentIntents.retrieve(body.payment_intent_id);
    if (intent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }
  }

  const conflict = await hasSchedulingConflict(
    appointment.pro_id as string,
    appointment.scheduled_start as string,
    appointment.scheduled_end as string,
    appointment.id as string,
  );
  if (conflict) {
    return NextResponse.json({ error: "This time is no longer available" }, { status: 409 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const { error: updateError } = await admin
    .from("appointments")
    .update({
      status: "confirmed",
      client_id: user?.id ?? appointment.client_id,
      guest_name: body.client_details.name,
      guest_email: body.client_details.email,
      guest_phone: body.client_details.phone ?? null,
      client_notes: body.client_details.notes ?? null,
      vision_attachments: body.client_details.vision_attachments ?? [],
      deposit_paid: depositAmount > 0,
      confirmation_sent: true,
      reserved_until: null,
    })
    .eq("id", appointment.id);

  if (updateError) {
    if (updateError.code === "23505") {
      return NextResponse.json({ error: "This time is no longer available" }, { status: 409 });
    }
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await logStatusChange({
    appointmentId: appointment.id as string,
    previousStatus: "pending_confirmation",
    newStatus: "confirmed",
    changedBy: user?.id ?? null,
    note: "Client confirmed booking",
  });

  const pro = appointment.pro_profiles as {
    username: string;
    display_name: string;
    location_city: string | null;
    location_state: string | null;
  };
  const service = appointment.services as { name: string; service_type?: string } | null;
  const locationLabel = [pro?.location_city, pro?.location_state].filter(Boolean).join(", ") || undefined;

  const videoSession = await createSessionForAppointment(appointment.id as string);
  const videoCallUrl =
    videoSession?.lobbyUrl ??
    (appointment.video_call_session_id
      ? videoCallLobbyUrl(appointment.video_call_session_id as string)
      : undefined);

  await notifyAppointmentConfirmed(admin, {
    clientUserId: user?.id ?? (appointment.client_id as string | null),
    proUserId: appointment.pro_id as string,
    serviceName: service?.name ?? "Appointment",
    appointmentId: appointment.id as string,
    clientName: body.client_details.name,
  });

  await sendAppointmentConfirmedEmails({
    appointmentId: appointment.id as string,
    clientName: body.client_details.name,
    clientEmail: body.client_details.email,
    proId: appointment.pro_id as string,
    proName: pro?.display_name ?? "Your professional",
    proUsername: pro?.username ?? "",
    serviceName: service?.name ?? "Appointment",
    scheduledStart: appointment.scheduled_start as string,
    scheduledEnd: appointment.scheduled_end as string,
    timezone: appointment.timezone as string,
    clientTimezone: body.client_details.client_timezone,
    locationLabel,
    videoCallUrl,
  });

  return NextResponse.json({
    appointment_id: appointment.id,
    status: "confirmed",
  });
}
