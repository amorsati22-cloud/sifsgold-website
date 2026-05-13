import { LegalLayout, legalLastUpdated } from "@/components/legal/LegalLayout";

export function LegalReviewPlaceholder({ title, currentPath }: { title: string; currentPath: string }) {
  const last = legalLastUpdated();
  return (
    <LegalLayout title={title} lastUpdated={last} currentPath={currentPath}>
      <Body last={last} />
    </LegalLayout>
  );
}

function Body({ last }: { last: string }) {
  return (
    <>
      <p>
        This document is currently under final legal review and will be published before public launch in June 2026. If you
        need to review draft versions for legitimate purposes (press, investor, partner), please contact us via the contact
        form.
      </p>
      <p className="mt-4 text-sm text-cream/70">Last updated: {last}</p>
    </>
  );
}
