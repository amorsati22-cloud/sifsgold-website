import "server-only";

import { formatAppointmentRange } from "@/lib/booking/availability-engine";
import { AppointmentCancelled, appointmentCancelledSubject } from "@/lib/email/templates/AppointmentCancelled";
import { AppointmentConfirmed, appointmentConfirmedSubject } from "@/lib/email/templates/AppointmentConfirmed";
import { isResendConfigured, sendEmail } from "@/lib/email/resend-client";
import { getProAuthEmail } from "@/lib/booking/appointments";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://sifsgold.com";

export type BookingEmailContext = {
  appointmentId: string;
  clientName: string;
  clientEmail: string;
  proId: string;
  proName: string;
  proUsername: string;
  serviceName: string;
  scheduledStart: string;
  scheduledEnd: string;
  timezone: string;
  clientTimezone?: string;
  locationLabel?: string;
  videoCallUrl?: string;
};

function appointmentUrl(id: string) {
  return `${SITE_URL}/booking/${id}`;
}

function rebookUrl(username: string, serviceId?: string) {
  const params = new URLSearchParams({ pro: username });
  if (serviceId) params.set("service_id", serviceId);
  return `${SITE_URL}/booking/new?${params.toString()}`;
}

export async function sendAppointmentConfirmedEmails(ctx: BookingEmailContext) {
  if (!isResendConfigured()) return;

  const whenClient = formatAppointmentRange(
    ctx.scheduledStart,
    ctx.scheduledEnd,
    ctx.clientTimezone ?? ctx.timezone,
  );
  const whenPro = formatAppointmentRange(ctx.scheduledStart, ctx.scheduledEnd, ctx.timezone);
  const url = appointmentUrl(ctx.appointmentId);

  const clientLinks = {
    viewInBrowserUrl: url,
    unsubscribeUrl: `${SITE_URL}/legal/privacy`,
    preferencesUrl: `${SITE_URL}/account`,
  };

  await sendEmail({
    to: ctx.clientEmail,
    subject: appointmentConfirmedSubject,
    react: (
      <AppointmentConfirmed
        recipientEmail={ctx.clientEmail}
        clientName={ctx.clientName}
        proName={ctx.proName}
        serviceName={ctx.serviceName}
        whenLabel={whenClient}
        locationLabel={ctx.locationLabel}
        appointmentUrl={url}
        videoCallUrl={ctx.videoCallUrl}
        {...clientLinks}
      />
    ),
  });

  const proEmail = await getProAuthEmail(ctx.proId);
  if (!proEmail) return;

  await sendEmail({
    to: proEmail,
    subject: `New booking: ${ctx.serviceName}`,
    react: (
      <AppointmentConfirmed
        recipientEmail={proEmail}
        clientName={ctx.clientName}
        proName={ctx.proName}
        serviceName={ctx.serviceName}
        whenLabel={whenPro}
        locationLabel={ctx.locationLabel}
        appointmentUrl={`${SITE_URL}/dashboard/calendar`}
        videoCallUrl={ctx.videoCallUrl}
        viewInBrowserUrl={`${SITE_URL}/dashboard/calendar`}
        unsubscribeUrl={clientLinks.unsubscribeUrl}
        preferencesUrl={clientLinks.preferencesUrl}
        forPro
      />
    ),
  });
}

export async function sendAppointmentCancelledEmails(input: {
  ctx: BookingEmailContext;
  cancelledBy: "client" | "pro";
  refundNote?: string;
  serviceId?: string;
}) {
  if (!isResendConfigured()) return;

  const { ctx, cancelledBy, refundNote, serviceId } = input;
  const when = formatAppointmentRange(
    ctx.scheduledStart,
    ctx.scheduledEnd,
    ctx.clientTimezone ?? ctx.timezone,
  );
  const links = {
    viewInBrowserUrl: appointmentUrl(ctx.appointmentId),
    unsubscribeUrl: `${SITE_URL}/legal/privacy`,
    preferencesUrl: `${SITE_URL}/account`,
  };

  await sendEmail({
    to: ctx.clientEmail,
    subject: appointmentCancelledSubject,
    react: (
      <AppointmentCancelled
        recipientEmail={ctx.clientEmail}
        name={ctx.clientName}
        proName={ctx.proName}
        serviceName={ctx.serviceName}
        whenLabel={when}
        cancelledBy={cancelledBy}
        refundNote={refundNote}
        rebookUrl={rebookUrl(ctx.proUsername, serviceId)}
        {...links}
      />
    ),
  });

  const proEmail = await getProAuthEmail(ctx.proId);
  if (!proEmail) return;

  await sendEmail({
    to: proEmail,
    subject: `Cancelled: ${ctx.serviceName}`,
    react: (
      <AppointmentCancelled
        recipientEmail={proEmail}
        name={ctx.proName}
        proName={ctx.proName}
        serviceName={ctx.serviceName}
        whenLabel={formatAppointmentRange(ctx.scheduledStart, ctx.scheduledEnd, ctx.timezone)}
        cancelledBy={cancelledBy}
        refundNote={refundNote}
        rebookUrl={`${SITE_URL}/dashboard/calendar`}
        {...links}
      />
    ),
  });
}
