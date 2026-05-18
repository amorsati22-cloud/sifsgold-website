import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const admin = createAdminClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!admin) {
    return NextResponse.json({ received: true });
  }

  switch (event.type) {
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;

      if (paymentIntentId) {
        const fullyRefunded = charge.amount_refunded >= charge.amount;
        await admin
          .from("orders")
          .update({ status: fullyRefunded ? "refunded" : "partially_refunded" })
          .eq("stripe_payment_intent_id", paymentIntentId);
      }
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
      if (chargeId) {
        await admin
          .from("orders")
          .update({
            internal_notes: `Dispute opened: ${dispute.id}. Reason: ${dispute.reason}`,
          })
          .eq("stripe_charge_id", chargeId);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      if (intent.receipt_email) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sifsgold.com";
        try {
          await fetch(`${siteUrl}/api/email/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-email-trigger-token": process.env.EMAIL_TRIGGER_TOKEN ?? "",
            },
            body: JSON.stringify({
              type: "shop_payment_failed",
              to: intent.receipt_email,
              data: { paymentIntentId: intent.id },
            }),
          });
        } catch {
          // best-effort
        }
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
