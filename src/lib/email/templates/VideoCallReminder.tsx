import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type VideoCallReminderProps = {
  recipientEmail: string;
  title: string;
  lobbyUrl: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function VideoCallReminder({
  recipientEmail,
  title,
  lobbyUrl,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: VideoCallReminderProps) {
  return (
    <EmailLayout
      preview="Your video call starts in about one hour"
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>Video call in 1 hour</Heading>
      <Text style={emailStyles.p}>
        <strong>{title}</strong> starts soon. Open the lobby to run a device check before you join.
      </Text>
      <Text style={emailStyles.p}>
        <Link href={lobbyUrl} style={emailStyles.link}>
          Join lobby
        </Link>
      </Text>
    </EmailLayout>
  );
}
