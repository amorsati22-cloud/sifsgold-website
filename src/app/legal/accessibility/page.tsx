import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Accessibility Statement",
};

export default function AccessibilityStatementPage() {
  return (
    <LegalPageShell title="Accessibility Statement">
      <h2 id="commitment">Commitment</h2>
      <p>
        Sif&apos;s Gold is committed to building and maintaining experiences aligned to WCAG 2.1
        AA standards.
      </p>

      <h2 id="ongoing-improvements">Ongoing Improvements</h2>
      <p>
        Accessibility work is ongoing and includes iterative design and engineering improvements as
        product features evolve.
      </p>

      <h2 id="standards-and-tools">Standards and Tools</h2>
      <ul>
        <li>Semantic HTML and keyboard navigation support</li>
        <li>Color contrast and focus visibility checks</li>
        <li>Screen reader spot testing and assistive workflow review</li>
        <li>Automated checks as part of development workflows</li>
      </ul>

      <h2 id="audit-status">Audit Status</h2>
      <p>Last audit date: pending pre-launch accessibility review.</p>

      <h2 id="reporting-issues">Reporting Accessibility Issues</h2>
      <p>Please use the contact path on our homepage to report accessibility issues.</p>
    </LegalPageShell>
  );
}

