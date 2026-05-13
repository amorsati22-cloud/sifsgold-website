import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Do Not Sell or Share My Personal Information",
};

export default function CcpaPage() {
  return (
    <LegalPageShell title="Do Not Sell or Share My Personal Information">
      <h2 id="ccpa-notice">CCPA/CPRA Notice</h2>
      <p>
        Sif&apos;s Gold does not sell or share personal information for cross-context behavioral
        advertising. This page exists to comply with CCPA/CPRA requirements.
      </p>

      <h2 id="opt-out">Opt-Out Request</h2>
      <p>
        This button is a placeholder while final request workflows are being finalized before
        launch.
      </p>
      <button
        type="button"
        className="mt-3 rounded-full border border-gold bg-gold px-5 py-2 text-sm font-semibold text-navy transition hover:shadow-lg"
      >
        Submit CCPA Opt-Out Request
      </button>

      <h2 id="california-rights">California Residents Rights</h2>
      <ul>
        <li>Right to know</li>
        <li>Right to delete</li>
        <li>Right to correct</li>
        <li>Right to limit</li>
        <li>Right to opt out</li>
        <li>Right to non-discrimination</li>
      </ul>

      <h2 id="important-note">Important Note</h2>
      <p>
        This is placeholder policy content pending final legal review and implementation details.
      </p>
    </LegalPageShell>
  );
}

