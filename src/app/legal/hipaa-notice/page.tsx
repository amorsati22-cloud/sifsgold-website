import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Notice of Privacy Practices - Med Spa Services",
};

export default function HipaaNoticePage() {
  return (
    <LegalPageShell title="Notice of Privacy Practices - Med Spa Services">
      <h2 id="scope">Scope</h2>
      <p>
        This notice is intended to apply only to med spa patients and participating med spa
        providers using applicable medical-service workflows on the platform.
      </p>

      <h2 id="phi-handling">PHI Handling</h2>
      <p>
        The final notice will describe how protected health information is used, stored, and
        disclosed in med spa workflows.
      </p>

      <h2 id="patient-rights">Patient Rights Under HIPAA</h2>
      <ul>
        <li>Right to access certain records</li>
        <li>Right to request corrections</li>
        <li>Right to request restrictions</li>
        <li>Right to request confidential communications</li>
        <li>Right to receive an accounting of certain disclosures</li>
      </ul>

      <h2 id="complaints">Complaint Procedures</h2>
      <p>
        The final notice will provide complaint escalation procedures and supervisory authority
        filing options.
      </p>

      <h2 id="effective-date">Effective Date</h2>
      <p>
        This Notice does not yet have an effective date. It will go into effect when our med spa
        features launch and any med spa provider signs up for the platform.
      </p>
    </LegalPageShell>
  );
}

