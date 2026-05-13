import type { Metadata } from "next";
import Link from "next/link";
import { LegalDmcaTakedownForm } from "@/components/legal/LegalDmcaTakedownForm";
import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "DMCA Copyright Policy",
  description:
    "DMCA designated agent status, takedown notices, counter-notices, and repeat infringer policy for Sif's Gold.",
  alternates: { canonical: `${BRAND.url}/legal/dmca` },
};

export default function DmcaPage() {
  const last = legalLastUpdated();
  return (
    <LegalLayout title="DMCA Copyright Policy" lastUpdated={last} currentPath="/legal/dmca">
      <h2 id="agent">Designated agent</h2>
      <p>
        DMCA Designated Agent: <strong>Registration with the U.S. Copyright Office pending.</strong> Until registration is
        complete, submit notices through the secure form below so we can timestamp and route them consistently.
      </p>

      <h2 id="takedown">Takedown notice</h2>
      <p>
        Use the form to provide the information typically required under the DMCA, including identification of the copyrighted
        work, the allegedly infringing material, and your good-faith statements. Submissions are sent through Web3Forms with
        source tag <code className="font-mono text-sm text-teal">dmca_takedown</code>.
      </p>
      <LegalDmcaTakedownForm idPrefix="dmca" />

      <h2 id="counter">Counter-notice</h2>
      <p>
        If you believe material was removed in error, you may submit a counter-notice that meets statutory requirements,
        including consent to jurisdiction and acceptance of process. We will follow the statutory restore-or-challenge timeline
        once counsel finalizes the template language for public launch.
      </p>

      <h2 id="repeat">Repeat infringer policy</h2>
      <p>
        We maintain a policy to terminate repeat infringers in appropriate circumstances, including after verified notices and
        appeals where applicable. Educators and community programs may receive additional guidance before enforcement actions
        that affect cohort access.
      </p>

      <h2 id="other">Other channels</h2>
      <p>
        For non-copyright issues, use the general{" "}
        <Link href="/contact" className="font-semibold text-gold underline-offset-4 hover:underline">
          contact form
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
