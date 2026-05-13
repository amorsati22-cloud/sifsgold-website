import {
  Ban,
  Lock,
  MapPin,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const TRUST_BADGES = [
  { label: "Built with Stripe", icon: WalletCards },
  { label: "Encrypted in transit", icon: Lock },
  { label: "Privacy-first", icon: ShieldCheck },
  { label: "No data selling, ever", icon: Ban },
  { label: "Built in Minnesota, USA", icon: MapPin },
] as const;

export function TrustStrip() {
  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-y border-gold/15 bg-navy/40 py-5 backdrop-blur-sm">
      <div className="mx-auto max-w-content px-4 sm:px-6 md:px-8">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5" aria-label="Trust highlights">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <li
                key={badge.label}
                className="flex items-center gap-2 rounded-brand-md border border-gold/15 bg-navy-deep/50 px-3 py-2"
              >
                <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span className="font-body text-[11px] uppercase tracking-[1px] text-cream/60 sm:text-xs">
                  {badge.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
