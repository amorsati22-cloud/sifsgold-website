import Link from "next/link";
import { BRAND } from "@/lib/constants";

const platformLinks = [
  { label: "For Professionals", href: "/for-professionals" },
  { label: "For Students", href: "/for-students" },
  { label: "For Clients", href: "/for-clients" },
  { label: "For Schools", href: "/for-schools" },
  { label: "For Salons", href: "/for-salons" },
  { label: "For Barbershops", href: "/for-barbershops" },
  { label: "For Storefronts", href: "/for-storefronts" },
  { label: "For Models", href: "/fashion" },
  { label: "For Brand Partners", href: "/for-brands" },
  { label: "Fashion Expansion", href: "/fashion" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Community Guidelines", href: "/community-guidelines" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Press", href: "/press" },
  { label: "Data Request", href: "/data-request" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 font-body text-sm font-semibold uppercase tracking-wide text-gold">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-body text-sm text-white/70 transition hover:text-gold"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-dark">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-heading text-xl font-bold text-gold">{BRAND.name}</p>
            <p className="mt-3 max-w-xs text-sm text-white/50">{BRAND.tagline}</p>
          </div>
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-white/40">
            © 2026 {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Built for everyone in beauty.</p>
        </div>
      </div>
    </footer>
  );
}
