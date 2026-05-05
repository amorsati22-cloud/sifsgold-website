export const BRAND = {
  name: "Sif's Gold",
  tagline: "The Beauty Platform Built for Everyone",
  launchDate: "2026-06-01T00:00:00",
  colors: { navy: "#04101E", gold: "#D4A843", teal: "#06D4BA" },
};

/** Primary navigation — desktop (md+) and mobile drawer. */
export const NAV_LINKS = [
  { label: "For Professionals", href: "/for-professionals" },
  { label: "For Students", href: "/for-students" },
  { label: "For Clients", href: "/for-clients" },
  { label: "For Schools", href: "/for-schools" },
  { label: "For Salons", href: "/for-salons" },
  { label: "For Barbershops", href: "/for-barbershops" },
  { label: "For Storefronts", href: "/for-storefronts" },
  { label: "For Brand Partners", href: "/for-brands" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Press", href: "/press" },
  { label: "Careers", href: "/careers" },
  { label: "Help", href: "/help" },
  { label: "Blog", href: "/blog" },
] as const;
