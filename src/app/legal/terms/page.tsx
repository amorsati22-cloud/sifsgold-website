import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <h2 id="placeholder-notice">Placeholder Notice</h2>
      <p>
        This is a placeholder Terms of Service page while final terms are reviewed with legal
        counsel before launch.
      </p>

      <h2 id="expected-scope">Expected Scope of Final Terms</h2>
      <ul>
        <li>Account eligibility and account requirements</li>
        <li>Prohibited conduct and platform misuse rules</li>
        <li>Professional conduct requirements for listed providers</li>
        <li>Payment and subscription terms</li>
        <li>Intellectual property ownership and licensing</li>
        <li>Limitations of liability</li>
        <li>Governing law: Minnesota</li>
        <li>Dispute resolution and arbitration</li>
        <li>How changes to terms are communicated</li>
      </ul>

      <h2 id="important-note">Important Note</h2>
      <p>
        This page is pre-launch placeholder content only and is not legal advice.
      </p>
    </LegalPageShell>
  );
}

