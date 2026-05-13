import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie Policy">
      <h2 id="placeholder-notice">Placeholder Notice</h2>
      <p>
        This is a placeholder Cookie Policy. The final policy will be published after legal review
        and consent tooling implementation.
      </p>

      <h2 id="what-cookies-are">What Cookies Are</h2>
      <p>
        The final policy will define cookies and similar tracking technologies, including local
        storage and related browser technologies.
      </p>

      <h2 id="categories">Planned Cookie Categories</h2>
      <ul>
        <li>Essential cookies</li>
        <li>Analytics cookies</li>
        <li>Marketing cookies</li>
      </ul>
      <p>
        At this stage, none of these categories are loaded in production until the consent banner
        is implemented.
      </p>

      <h2 id="management-and-third-parties">Cookie Management and Third Parties</h2>
      <p>
        The final policy will include browser-based cookie management instructions and disclosures
        around any third-party cookies in use.
      </p>
    </LegalPageShell>
  );
}

