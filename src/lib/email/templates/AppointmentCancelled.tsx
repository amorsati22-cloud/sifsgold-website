import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type AppointmentCancelledProps = {
  recipientEmail: string;
  name?: string;
  proName: string;
  serviceName: string;
  whenLabel: string;
  cancelledBy: "client" | "pro";
  refundNote?: string;
  rebookUrl: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function AppointmentCancelled({
  recipientEmail,
  name,
  proName,
  serviceName,
  whenLabel,
  cancelledBy,
  refundNote,
  rebookUrl,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: AppointmentCancelledProps) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="Appointment cancelled"
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>Appointment cancelled</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        Your {serviceName} appointment with {proName} on {whenLabel} was cancelled
        {cancelledBy === "client" ? " at your request" : " by your professional"}.
      </Text>
      {refundNote ? <Text style={emailStyles.p}>{refundNote}</Text> : null}
      <Text style={emailStyles.p}>
        <Link href={rebookUrl} style={emailStyles.link}>
          Book again
        </Link>
      </Text>
      <Text style={emailStyles.p}>— The Sif&apos;s Gold Team</Text>
    </EmailLayout>
  );
}

export const appointmentCancelledSubject = "Appointment cancelled";
