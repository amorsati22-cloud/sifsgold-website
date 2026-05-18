"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { GoldButton } from "@/components/ui/GoldButton";

type Props = {
  reason?: string;
};

export function ProOnlyGate({ reason }: Props) {
  const theme = useTheme();

  return (
    <div
      className="rounded-brand-md border border-gold/30 p-6"
      style={{ backgroundColor: theme.colors.navyLift }}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Lock className="mt-0.5 h-6 w-6 shrink-0 text-gold" aria-hidden />
        <div className="space-y-3">
          <h2 className="font-heading text-xl text-gold">Professional license required</h2>
          <p className="font-body text-sm text-cream/90">
            {reason ??
              "This product is reserved for licensed beauty professionals in The Gold Collective. Client accounts cannot purchase professional-use chemicals."}
          </p>
          <p className="font-body text-sm text-gold-body">
            Sif&apos;s Advocates with verified licenses unlock the full Beauty Supply Store. Gold Partners supply
            curated pro-grade inventory.
          </p>
          <div className="flex flex-wrap gap-3">
            <GoldButton label="Verify as a Pro" href="/for-pros" variant="solid" size="sm" />
            <Link href="/sign-in" className="font-body text-sm text-gold underline hover:text-gold-light">
              Sign in to your pro account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
