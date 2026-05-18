import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Sif's Gold account password.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter the email on your account. We'll send a secure link to choose a new password."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
