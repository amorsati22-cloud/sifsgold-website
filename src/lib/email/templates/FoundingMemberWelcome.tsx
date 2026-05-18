import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type FoundingMemberWelcomeProps = {
  recipientEmail: string;
  firstName?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function FoundingMemberWelcome({
  recipientEmail,
  firstName,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: FoundingMemberWelcomeProps) {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="You're a Founding Member — here's what that means."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>You&apos;re a Founding Member.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        Thank you for joining as a Founding Member of Sif&apos;s Gold. Here is what that means for
        you inside The Gold Collective:
      </Text>
      <ul style={emailStyles.list}>
        <li>
          <strong>Permanent Founding Member badge</strong> on your profile
        </li>
        <li>
          <strong>20% off your first year</strong> on eligible membership tiers
        </li>
        <li>
          <strong>30 days free</strong> on Pro or Premium when those plans open for your role
        </li>
        <li>
          <strong>1.25× creator earnings boost</strong> for qualifying Sif&apos;s Advocates revenue
          during the founding window
        </li>
        <li>
          <strong>Early access</strong> to features before public marketing — with clear beta labels
        </li>
        <li>
          <strong>Direct line to our team</strong> for the first 60 days after your workspace is
          active
        </li>
      </ul>
      <Text style={emailStyles.muted}>
        Timeline: we will email you when your founding window opens for onboarding. Fashion industry
        modules expand June 30, 2026; core beauty and grooming flows lead the first wave.
      </Text>
      <Text style={emailStyles.p}>
        We are glad you are building this with us.
        <br />
        — The Sif&apos;s Gold Team
      </Text>
      <Link href="https://sifsgold.com/founding-member" style={emailStyles.button}>
        Founding Member details
      </Link>
    </EmailLayout>
  );
}

export const foundingMemberWelcomeSubject = "You're a Founding Member. Here's what that means.";
