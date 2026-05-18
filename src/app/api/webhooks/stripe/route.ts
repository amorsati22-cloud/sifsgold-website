import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPricingTierById } from "@/data/pricing";
import { getStripe } from "@/lib/stripe";
import { logStripeWebhookEvent } from "@/lib/stripe/webhook-log";
import { sendSubscriptionWelcomeEmail } from "@/lib/stripe/welcome-email";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function sessionTierId(session: Stripe.Checkout.Session): string | undefined {
  return session.metadata?.tierId;
}

function subscriptionTierId(subscription: Stripe.Subscription): string | undefined {
  return subscription.metadata?.tierId;
}

async function handleSubscriptionCheckoutCompleted(
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
) {
  const tierId = sessionTierId(session);
  const tier = tierId ? getPricingTierById(tierId) : null;
  const email =
    session.customer_details?.email ?? session.customer_email ?? undefined;

  await logStripeWebhookEvent(
    event,
    `Checkout completed for tier ${tierId ?? "unknown"}`,
    {
      tierId,
      billing: session.metadata?.billing,
      customer:
        typeof session.customer === "string" ? session.customer : session.customer?.id,
    },
  );

  if (email) {
    await sendSubscriptionWelcomeEmail(email, tier);
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription") {
        await handleSubscriptionCheckoutCompleted(event, session);
      }
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      await logStripeWebhookEvent(event, "Subscription created", {
        tierId: subscriptionTierId(subscription),
        status: subscription.status,
        customer:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id,
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await logStripeWebhookEvent(event, "Subscription updated", {
        tierId: subscriptionTierId(subscription),
        status: subscription.status,
        customer:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id,
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await logStripeWebhookEvent(event, "Subscription canceled", {
        tierId: subscriptionTierId(subscription),
        customer:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id,
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await logStripeWebhookEvent(event, "Invoice payment failed", {
        customer:
          typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id,
        subscription:
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id,
      });
      console.info(
        "[stripe/webhook] payment failure email template pending — invoice",
        invoice.id,
      );
      break;
    }

    case "charge.refunded": {
      if (!admin) break;
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;

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
      if (!admin) break;
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
      if (!admin) break;
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
