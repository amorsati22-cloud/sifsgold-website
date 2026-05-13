import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Community Guidelines",
};

export default function CommunityGuidelinesLegalPage() {
  return (
    <LegalPageShell title="Community Guidelines">
      <h2 id="placeholder-notice">Placeholder Notice</h2>
      <p>
        This is placeholder community guidance that will be replaced by final policy language
        before launch.
      </p>

      <h2 id="core-standards">Core Standards (Planned)</h2>
      <ul>
        <li>Respect and professionalism in all platform interactions</li>
        <li>No harassment, intimidation, or hate speech</li>
        <li>Accurate and authentic profile and photo representation</li>
        <li>Clear FTC disclosures when required for promotional activity</li>
        <li>Prompt reporting of harmful or policy-violating behavior</li>
      </ul>

      <h2 id="reporting-and-moderation">Reporting and Moderation</h2>
      <p>
        The final policy will define moderation review timelines, enforcement tiers, and how users
        can report bad behavior.
      </p>
    </LegalPageShell>
  );
}

