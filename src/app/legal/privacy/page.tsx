import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <h2 id="placeholder-notice">Placeholder Notice</h2>
      <p>
        This is a placeholder document. Sif&apos;s Gold&apos;s full Privacy Policy is being
        prepared with legal counsel and will be published before launch.
      </p>
      <p>
        The final policy will explain what data we collect, how we use it, your rights under
        CCPA and GDPR, how to access and delete your data, our data retention practices, and how
        we handle children&apos;s privacy under COPPA.
      </p>

      <h2 id="current-status">Current Status</h2>
      <p>
        Until the final policy is published, no production data is being collected through this
        site.
      </p>

      <h2 id="important-note">Important Note</h2>
      <p>
        This page is a pre-launch placeholder and is not legal advice. Final language will be
        reviewed before launch.
      </p>
    </LegalPageShell>
  );
}

