import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type ContactFormConfirmationProps = {
  recipientEmail: string;
  name?: string;
  reason?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function ContactFormConfirmation({
  recipientEmail,
  name,
  reason = "General",
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: ContactFormConfirmationProps) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="We got your message."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>We got your message.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        Thanks for contacting Sif&apos;s Gold. This confirms we received your note.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Category:</strong> {reason}
        <br />
        Your message was routed to the right inbox for that topic.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Response time:</strong> we aim to reply
        within two business days. Press and partnership requests may take slightly longer during
        launch windows.
      </Text>
      <Text style={emailStyles.p}>
        If this was not you, please use our contact form on the website so we can investigate.
      </Text>
      <Text style={emailStyles.p}>
        — The Sif&apos;s Gold Team
      </Text>
    </EmailLayout>
  );
}

export const contactFormConfirmationSubject = "We got your message.";
