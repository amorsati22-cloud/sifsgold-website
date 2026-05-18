import "server-only";

import { Resend } from "resend";
import type { ReactElement } from "react";
import { EMAIL_FROM } from "@/lib/email/constants";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
};

let resendClient: Resend | null = null;

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey === "re_placeholder") {
    throw new Error(
      "RESEND_API_KEY is missing or still set to the placeholder. Add your key to .env.local after Resend domain verification.",
    );
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendEmail({
  to,
  subject,
  react,
  from = EMAIL_FROM.default,
  replyTo = EMAIL_FROM.replyTo,
}: SendEmailInput) {
  const resend = getResend();
  const recipients = Array.isArray(to) ? to : [to];

  if (process.env.NODE_ENV === "development") {
    console.info("[email] send", {
      to: recipients,
      subject,
      from,
      replyTo,
    });
  }

  const result = await resend.emails.send({
    from,
    to: recipients,
    subject,
    react,
    replyTo,
  });

  if (process.env.NODE_ENV === "development") {
    console.info("[email] result", result);
  }

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}

export function isResendConfigured(): boolean {
  const key = process.env.RESEND_API_KEY?.trim();
  return Boolean(key && key !== "re_placeholder");
}
