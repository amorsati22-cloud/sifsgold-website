import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "DMCA Copyright Policy",
};

export default function DmcaPolicyPage() {
  return (
    <LegalPageShell title="DMCA Copyright Policy">
      <h2 id="placeholder-notice">Placeholder Notice</h2>
      <p>
        This DMCA page is a placeholder while final takedown and counter-notice procedures are
        prepared for launch.
      </p>

      <h2 id="designated-agent">Designated Agent</h2>
      <p>
        Our DMCA Designated Agent will be registered with the U.S. Copyright Office prior to
        launch. Updated contact details will appear here. To submit a takedown notice, please use
        the contact form on our homepage.
      </p>

      <h2 id="final-policy-scope">Final Policy Scope</h2>
      <p>
        The final policy will define notice requirements, counter-notice process, repeat infringer
        handling, and record retention for copyright complaints.
      </p>
    </LegalPageShell>
  );
}

