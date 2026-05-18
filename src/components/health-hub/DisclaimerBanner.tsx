import Link from "next/link";
import { HEALTH_DISCLAIMER_SHORT } from "@/lib/health-hub/constants";

export function DisclaimerBanner({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-brand-md border border-gold/20 bg-navy-deep/80 px-4 py-3 font-body text-xs text-cream/80 ${className}`.trim()}
      role="note"
    >
      <p>{HEALTH_DISCLAIMER_SHORT}</p>
      <p className="mt-1 text-goldBody">
        <Link
          href="/dashboard/health-hub/disclaimer"
          className="text-gold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Full disclaimer
        </Link>
      </p>
    </aside>
  );
}
