import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type AppointmentConfirmedProps = {
  recipientEmail: string;
  clientName?: string;
  proName: string;
  serviceName: string;
  whenLabel: string;
  locationLabel?: string;
  videoCallUrl?: string;
  appointmentUrl: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
  forPro?: boolean;
};

export function AppointmentConfirmed({
  recipientEmail,
  clientName,
  proName,
  serviceName,
  whenLabel,
  locationLabel,
  videoCallUrl,
  appointmentUrl,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
  forPro = false,
}: AppointmentConfirmedProps) {
  const greeting = clientName?.trim() ? `Hi ${clientName.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview={forPro ? "New booking confirmed" : "Your appointment is confirmed"}
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>
        {forPro ? "New appointment booked" : "You&apos;re confirmed"}
      </Heading>
      <Text style={emailStyles.p}>{forPro ? `Hi ${proName},` : greeting}</Text>
      <Text style={emailStyles.p}>
        {forPro
          ? `${clientName ?? "A client"} booked ${serviceName}.`
          : `Your appointment with ${proName} is confirmed.`}
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Service:</strong> {serviceName}
        <br />
        <strong style={{ color: emailStyles.link.color }}>When:</strong> {whenLabel}
        {locationLabel ? (
          <>
            <br />
            <strong style={{ color: emailStyles.link.color }}>Where:</strong> {locationLabel}
          </>
        ) : null}
      </Text>
      {videoCallUrl ? (
        <Text style={emailStyles.p}>
          <strong style={{ color: emailStyles.link.color }}>Video call:</strong>{" "}
          <Link href={videoCallUrl} style={emailStyles.link}>
            Join lobby (device check)
          </Link>
        </Text>
      ) : null}
      <Text style={emailStyles.p}>
        <Link href={appointmentUrl} style={emailStyles.link}>
          View appointment details
        </Link>
      </Text>
      <Text style={emailStyles.p}>— The Sif&apos;s Gold Team</Text>
    </EmailLayout>
  );
}

export const appointmentConfirmedSubject = "Your appointment is confirmed";
