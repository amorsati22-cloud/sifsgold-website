import "server-only";

import { createVideoCallSession } from "@/lib/video-calls/sessions";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://sifsgold.com";

/** Create a video session when a virtual_consultation appointment is confirmed. */
export async function createSessionForAppointment(appointmentId: string) {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: appointment } = await admin
    .from("appointments")
    .select(
      "id, pro_id, client_id, guest_email, scheduled_start, scheduled_end, timezone, video_call_session_id, services(name, service_type)",
    )
    .eq("id", appointmentId)
    .maybeSingle();

  if (!appointment || appointment.video_call_session_id) return null;

  const svc = appointment.services;
  const service = (Array.isArray(svc) ? svc[0] : svc) as {
    name: string;
    service_type?: string;
  } | null;
  if (service?.service_type !== "virtual_consultation") return null;

  const hostProfileId = appointment.pro_id as string;
  const participantIds = appointment.client_id ? [appointment.client_id as string] : [];

  const result = await createVideoCallSession({
    hostId: hostProfileId,
    title: service?.name ?? "Virtual consultation",
    sessionType: "consultation",
    scheduledStart: appointment.scheduled_start as string,
    scheduledEnd: appointment.scheduled_end as string,
    timezone: (appointment.timezone as string) ?? "America/Chicago",
    linkedAppointmentId: appointmentId,
    participantUserIds: participantIds,
    participantEmails: appointment.guest_email ? [appointment.guest_email as string] : [],
  });

  if ("error" in result) return null;
  return {
    sessionId: result.session.id as string,
    lobbyUrl: `${SITE_URL}/dashboard/video-calls/${result.session.id}`,
  };
}

export function videoCallLobbyUrl(sessionId: string) {
  return `${SITE_URL}/dashboard/video-calls/${sessionId}`;
}
