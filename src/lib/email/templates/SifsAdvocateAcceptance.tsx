import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export type SifsAdvocateAcceptanceProps = {
  recipientEmail: string;
  applicantName?: string;
  tier?: string;
  agreementUrl?: string;
  dashboardUrl?: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

export function SifsAdvocateAcceptance({
  recipientEmail,
  applicantName,
  tier = "Advocate",
  agreementUrl = "https://sifsgold.com/legal/advocate-agreement",
  dashboardUrl = "https://sifsgold.com/advocates",
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
}: SifsAdvocateAcceptanceProps) {
  const greeting = applicantName?.trim() ? `Hi ${applicantName.trim()},` : "Hi there,";

  return (
    <EmailLayout
      preview="Welcome to Sif's Advocates."
      recipientEmail={recipientEmail}
      viewInBrowserUrl={viewInBrowserUrl}
      unsubscribeUrl={unsubscribeUrl}
      preferencesUrl={preferencesUrl}
    >
      <Heading style={emailStyles.h1}>Welcome to Sif&apos;s Advocates.</Heading>
      <Text style={emailStyles.p}>{greeting}</Text>
      <Text style={emailStyles.p}>
        Your application was accepted. You are starting at the <strong>{tier}</strong> tier inside
        The Gold Collective.
      </Text>
      <Text style={emailStyles.p}>
        Sif&apos;s Advocates earn through five revenue streams — not view-count gimmicks:
      </Text>
      <ul style={emailStyles.list}>
        <li>Courses and structured learning paths</li>
        <li>Digital goods and templates</li>
        <li>Live sessions and office hours</li>
        <li>Referrals with published terms</li>
        <li>Gold Partner collaborations</li>
      </ul>
      <Text style={emailStyles.p}>
        Please review and sign the Advocate agreement before publishing. Your dashboard unlocks
        after the agreement is on file.
      </Text>
      <Link href={agreementUrl} style={emailStyles.button}>
        Review Advocate agreement
      </Link>
      <Text style={{ ...emailStyles.p, marginTop: "24px" }}>
        <Link href={dashboardUrl} style={emailStyles.link}>
          Open your Advocate dashboard →
        </Link>
      </Text>
      <Text style={emailStyles.p}>
        — The Sif&apos;s Gold Team
      </Text>
    </EmailLayout>
  );
}

export const sifsAdvocateAcceptanceSubject = "Welcome to Sif's Advocates.";
