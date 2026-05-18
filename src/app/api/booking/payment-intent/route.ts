import { NextResponse } from "next/server";
import { bookingCents, getAppointmentById } from "@/lib/booking/appointments";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  appointment_id: string;
  reservation_token: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const stripe = getStripe();
  const admin = createAdminClient();

  if (!stripe || !admin) {
    return NextResponse.json({ error: "Payments unavailable" }, { status: 503 });
  }

  const appointment = await getAppointmentById(body.appointment_id);
  if (!appointment || appointment.reservation_token !== body.reservation_token) {
    return NextResponse.json({ error: "Invalid reservation" }, { status: 403 });
  }

  if (appointment.status !== "pending_confirmation") {
    return NextResponse.json({ error: "Appointment already processed" }, { status: 400 });
  }

  const depositAmount = Number(appointment.deposit_amount);
  if (depositAmount <= 0) {
    return NextResponse.json({ skip_payment: true });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: bookingCents(depositAmount),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      appointment_id: appointment.id,
      pro_id: appointment.pro_id,
      type: "booking_deposit",
    },
  });

  await admin
    .from("appointments")
    .update({ deposit_stripe_payment_intent_id: paymentIntent.id })
    .eq("id", appointment.id);

  return NextResponse.json({
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
    amount: depositAmount,
  });
}
