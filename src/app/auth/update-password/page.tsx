import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Choose a new password for your Sif's Gold account.",
  robots: { index: false, follow: false },
};

export default function UpdatePasswordPage() {
  return (
    <AuthShell title="Choose a new password" description="Your reset link is valid for a limited time.">
      <UpdatePasswordForm />
    </AuthShell>
  );
}
