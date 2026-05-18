import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type LaunchDayAnnouncementProps = {
  recipientEmail: string;
  firstName?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function LaunchDayAnnouncement({
  recipientEmail,
  firstName,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: LaunchDayAnnouncementProps) {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="Sif's Gold is live."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>Sif&apos;s Gold is live.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        Today we open Sif&apos;s Gold to The Gold Collective — beauty, grooming, fitness, and fashion
        on one platform. Thank you for waiting with us.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Get the app:</strong>
      </Text>
      <ul style={emailStyles.list}>
        <li>
          <Link href="https://apps.apple.com/app/sifsgold" style={emailStyles.link}>
            App Store (placeholder link)
          </Link>
        </li>
        <li>
          <Link href="https://play.google.com/store/apps/details?id=com.sifsgold" style={emailStyles.link}>
            Google Play (placeholder link)
          </Link>
        </li>
      </ul>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>Founding Members:</strong> sign in with the
        email you used to register. Your badge and pricing lock apply automatically when your
        workspace is provisioned.
      </Text>
      <Text style={emailStyles.p}>
        <strong style={{ color: emailStyles.link.color }}>First steps inside the app:</strong>
      </Text>
      <ul style={emailStyles.list}>
        <li>Complete your profile and shop type</li>
        <li>Connect calendar or import clients if you are a pro</li>
        <li>Open Health Hub if you want pre-shift check-ins</li>
        <li>Students: pick your state board prep path</li>
      </ul>
      <Link href="https://sifsgold.com/sign-in" style={emailStyles.button}>
        Sign in to Sif&apos;s Gold
      </Link>
      <Text style={{ ...emailStyles.p, marginTop: "24px" }}>
        See you inside.
        <br />
        — The Sif&apos;s Gold Team
      </Text>
    </EmailLayout>
  );
}

export const launchDayAnnouncementSubject = "Sif's Gold is live.";
