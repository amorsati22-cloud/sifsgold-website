import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { EMAIL_BRAND } from "@/lib/email/constants";

type EmailLayoutProps = {
  preview: string;
  recipientEmail: string;
  viewInBrowserUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
  children: ReactNode;
};

function GoddessMark() {
  const { gold, navy } = EMAIL_BRAND.colors;
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="30" stroke={gold} strokeWidth="1.5" fill="none" />
      <path
        fill={gold}
        fillOpacity={0.9}
        d="M32 18c-4.5 0-8 3.2-8 7.2 0 2.1 1 4 2.5 5.2-1.2 1.4-2 3.2-2 5.1v2.5h15v-2.5c0-1.9-.7-3.7-1.9-5.1 1.5-1.2 2.4-3.1 2.4-5.2 0-4-3.5-7.2-8-7.2zm-9 22v6c0 2 1.6 3.6 3.6 3.6h10.8c2 0 3.6-1.6 3.6-3.6v-6H23z"
      />
    </svg>
  );
}

export function EmailLayout({
  preview,
  recipientEmail,
  viewInBrowserUrl,
  unsubscribeUrl,
  preferencesUrl,
  children,
}: EmailLayoutProps) {
  const { navy, navyDeep, cream, gold, goldBody } = EMAIL_BRAND.colors;

  return (
    <Html lang="en">
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- React Email requires linked web fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "24px 12px",
          backgroundColor: navyDeep,
          fontFamily: EMAIL_BRAND.fonts.body,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: navy,
            borderRadius: "12px",
            border: `1px solid ${gold}33`,
            overflow: "hidden",
          }}
        >
          <Section style={{ padding: "28px 32px 8px", textAlign: "center" }}>
            <GoddessMark />
            <Text
              style={{
                margin: "12px 0 0",
                fontFamily: EMAIL_BRAND.fonts.headline,
                fontSize: "22px",
                fontWeight: 700,
                color: gold,
              }}
            >
              Sif&apos;s Gold
            </Text>
          </Section>

          <Section style={{ padding: "8px 32px 32px", color: cream }}>{children}</Section>

          <Hr style={{ borderColor: `${gold}33`, margin: "0 32px" }} />

          <Section style={{ padding: "24px 32px 32px" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "20px",
                color: goldBody,
              }}
            >
              {EMAIL_BRAND.name} · {EMAIL_BRAND.mailingAddress}
            </Text>
            <Text style={{ margin: "12px 0 0", fontSize: "12px", lineHeight: "20px", color: cream }}>
              Sent to {recipientEmail}.{" "}
              <Link href={viewInBrowserUrl} style={{ color: gold }}>
                View in browser
              </Link>
              {" · "}
              <Link href={preferencesUrl} style={{ color: gold }}>
                Email preferences
              </Link>
              {" · "}
              <Link href={unsubscribeUrl} style={{ color: gold }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
