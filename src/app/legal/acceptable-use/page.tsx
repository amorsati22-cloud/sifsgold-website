import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
};

export default function AcceptableUsePage() {
  return (
    <LegalPageShell title="Acceptable Use Policy">
      <h2 id="placeholder-notice">Placeholder Notice</h2>
      <p>
        This Acceptable Use Policy is a pre-launch placeholder and will be finalized before launch
        with legal review.
      </p>

      <h2 id="prohibited-conduct">Prohibited Conduct (Planned)</h2>
      <ul>
        <li>No harassment, threats, or abusive behavior</li>
        <li>No fraudulent reviews or manipulated ratings</li>
        <li>No impersonation or deceptive identity behavior</li>
        <li>No illegal services or unlawful content</li>
        <li>No minor-targeting sexualized content</li>
      </ul>

      <h2 id="enforcement">Enforcement Framework</h2>
      <p>
        The final version is expected to include escalating enforcement up to a three-strike
        system and account termination for severe or repeated violations.
      </p>

      <h2 id="important-note">Important Note</h2>
      <p>This page does not provide legal advice and is for placeholder use only.</p>
    </LegalPageShell>
  );
}

