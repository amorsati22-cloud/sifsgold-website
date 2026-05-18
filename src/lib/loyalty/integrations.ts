import "server-only";

import { awardPoints, getOrCreateMembership } from "@/lib/loyalty/points-engine";
import { processReferralOnFirstAppointment } from "@/lib/loyalty/referral-engine";
import { createAdminClient } from "@/lib/supabase/admin";

/** Award loyalty points when an appointment is marked completed. */
export async function awardLoyaltyForAppointment(appointmentId: string) {
  const admin = createAdminClient();
  if (!admin) return;

  const { data: appointment } = await admin
    .from("appointments")
    .select("id, client_id, pro_id, price_total, status")
    .eq("id", appointmentId)
    .maybeSingle();

  if (!appointment?.client_id || appointment.status !== "completed") return;

  const { data: program } = await admin
    .from("loyalty_programs")
    .select("id, points_per_dollar, points_per_appointment, active")
    .eq("owner_id", appointment.pro_id)
    .eq("owner_type", "pro")
    .eq("active", true)
    .maybeSingle();

  if (!program) return;

  const membershipId = await getOrCreateMembership(
    admin,
    program.id as string,
    appointment.client_id as string,
  );
  if (!membershipId) return;

  const pricePoints = Math.floor(
    Number(appointment.price_total) * Number(program.points_per_dollar),
  );
  const visitBonus = Number(program.points_per_appointment) || 0;
  const total = pricePoints + visitBonus;

  if (total > 0) {
    const { data: dup } = await admin
      .from("loyalty_transactions")
      .select("id")
      .eq("membership_id", membershipId)
      .eq("source", "appointment")
      .eq("source_id", appointmentId)
      .maybeSingle();

    if (!dup) {
      await awardPoints(admin, {
        membershipId,
        points: total,
        source: "appointment",
        sourceId: appointmentId,
        description: `Appointment completed ($${appointment.price_total})`,
      });
    }
  }

  await processReferralOnFirstAppointment(
    admin,
    appointmentId,
    appointment.client_id as string,
  );
}

/** Award loyalty points after a product order is paid. */
export async function awardLoyaltyForOrder(orderId: string, buyerId: string) {
  const admin = createAdminClient();
  if (!admin) return;

  const { data: items } = await admin
    .from("order_items")
    .select("line_total, storefront_id")
    .eq("order_id", orderId);

  if (!items?.length) return;

  for (const item of items) {
    const storefrontId = item.storefront_id as string;
    const { data: program } = await admin
      .from("loyalty_programs")
      .select("id, points_per_dollar, active")
      .eq("owner_id", storefrontId)
      .eq("owner_type", "brand")
      .eq("active", true)
      .maybeSingle();

    if (!program) continue;

    const membershipId = await getOrCreateMembership(admin, program.id as string, buyerId);
    if (!membershipId) continue;

    const points = Math.floor(Number(item.line_total) * Number(program.points_per_dollar));
    if (points <= 0) continue;

    await awardPoints(admin, {
      membershipId,
      points,
      source: "product_purchase",
      sourceId: orderId,
      description: "Product purchase points",
    });
  }
}
