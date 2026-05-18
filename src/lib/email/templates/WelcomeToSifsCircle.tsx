import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type WelcomeToSifsCircleProps = {
  recipientEmail: string;
  firstName?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function WelcomeToSifsCircle({
  recipientEmail,
  firstName,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: WelcomeToSifsCircleProps) {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="You're in Sif's Circle — welcome to The Gold Collective."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>You&apos;re in Sif&apos;s Circle.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        Thank you for joining Sif&apos;s Circle — our early access list for The Gold Collective. You
        are with students, licensed professionals, Sif&apos;s Advocates, and Gold Partners who are
        helping shape one platform for beauty, grooming, fitness, and fashion.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>What happens next:</strong> we will send
        launch timing, onboarding checklists, and honest updates as features ship. No spam — only
        notes when something matters for your work.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Founding Member preview:</strong> a
        limited window opens before public launch with locked pricing, early feature access, and a
        direct line to our team. Details arrive in a separate note if you qualify.
      </Text>
      <Text style={emailStyles.p}>
        See you at launch.
        <br />
        — The Sif&apos;s Gold Team
      </Text>
      <Link href="https://sifsgold.com/founding-member" style={emailStyles.button}>
        Learn about Founding Members
      </Link>
    </EmailLayout>
  );
}

export const welcomeToSifsCircleSubject = "You're in Sif's Circle.";
