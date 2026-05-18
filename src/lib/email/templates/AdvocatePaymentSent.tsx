import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type AdvocatePaymentSentProps = {
  recipientEmail: string;
  amount?: string;
  dealTitle?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function AdvocatePaymentSent({ recipientEmail, amount = "$0.00", dealTitle, viewInBrowserUrl, unsubscribeUrl, preferencesUrl }: AdvocatePaymentSentProps) {
  return (
    <EmailLayout preview="Payout sent" recipientEmail={recipientEmail} viewInBrowserUrl={viewInBrowserUrl} unsubscribeUrl={unsubscribeUrl} preferencesUrl={preferencesUrl}>
      <Heading style={emailStyles.h1}>Payout sent</Heading>
      <Text style={emailStyles.p}>We sent {amount} to your connected Stripe account{dealTitle ? ` for ${dealTitle}` : ""}.</Text>
      <Text style={emailStyles.p}>Net amounts appear in your advocate earnings dashboard and count toward annual tax reporting when thresholds apply.</Text>
    </EmailLayout>
  );
}

export const advocatePaymentSentSubject = "Your Sif's Advocate payout was sent";
