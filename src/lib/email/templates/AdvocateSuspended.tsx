import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type AdvocateSuspendedProps = {
  recipientEmail: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function AdvocateSuspended({ recipientEmail, viewInBrowserUrl, unsubscribeUrl, preferencesUrl }: AdvocateSuspendedProps) {
  return (
    <EmailLayout preview="Advocate account suspended" recipientEmail={recipientEmail} viewInBrowserUrl={viewInBrowserUrl} unsubscribeUrl={unsubscribeUrl} preferencesUrl={preferencesUrl}>
      <Heading style={emailStyles.h1}>Advocate account suspended</Heading>
      <Text style={emailStyles.p}>Your Sif&apos;s Advocate account was suspended after three FTC compliance violations.</Text>
      <Text style={emailStyles.p}>Contact support if you believe this was an error or to discuss reinstatement after remediation.</Text>
    </EmailLayout>
  );
}

export const advocateSuspendedSubject = "Your Sif's Advocate account has been suspended";
