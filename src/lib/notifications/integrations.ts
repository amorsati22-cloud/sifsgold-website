import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { dispatchNotification, dispatchToUsers } from "@/lib/notifications/dispatch";

export async function notifyAppointmentConfirmed(
  admin: SupabaseClient,
  params: {
    clientUserId: string | null;
    proUserId: string;
    serviceName: string;
    appointmentId: string;
    clientName: string;
  },
) {
  const url = "/dashboard/calendar";
  await dispatchNotification(admin, {
    userId: params.proUserId,
    category: "booking",
    type: "appointment_confirmed",
    title: "New booking confirmed",
    body: `${params.clientName} booked ${params.serviceName}`,
    actionUrl: url,
    urgent: true,
  });
  if (params.clientUserId) {
    await dispatchNotification(admin, {
      userId: params.clientUserId,
      category: "booking",
      type: "appointment_confirmed",
      title: "Appointment confirmed",
      body: params.serviceName,
      actionUrl: "/dashboard/appointments",
      urgent: true,
    });
  }
}

export async function notifyNewMessage(
  admin: SupabaseClient,
  params: { recipientIds: string[]; threadId: string; senderName: string },
) {
  await dispatchToUsers(admin, params.recipientIds, {
    category: "message",
    type: "new_message",
    title: "New message",
    body: `From ${params.senderName}`,
    actionUrl: `/dashboard/messages/${params.threadId}`,
  });
}

export async function notifyTipReceived(
  admin: SupabaseClient,
  params: { streamerId: string; amount: number; streamId: string },
) {
  await dispatchNotification(admin, {
    userId: params.streamerId,
    category: "payment",
    type: "tip_received",
    title: "Tip received",
    body: `You received $${params.amount.toFixed(2)}`,
    actionUrl: `/dashboard/live/${params.streamId}`,
  });
}

export async function notifyOrderPlaced(
  admin: SupabaseClient,
  params: { buyerUserId: string | null; sellerUserId: string; orderNumber: string; orderId: string },
) {
  await dispatchNotification(admin, {
    userId: params.sellerUserId,
    category: "payment",
    type: "order_placed",
    title: "New order",
    body: `Order ${params.orderNumber}`,
    actionUrl: "/dashboard/orders",
  });
  if (params.buyerUserId) {
    await dispatchNotification(admin, {
      userId: params.buyerUserId,
      category: "payment",
      type: "order_placed",
      title: "Order confirmed",
      body: `Order ${params.orderNumber}`,
      actionUrl: `/shop/order-confirmation/${params.orderId}`,
      digestOnly: true,
    });
  }
}
