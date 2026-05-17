export const HELP_CATEGORIES = [
  { slug: "getting-started", title: "Getting Started", blurb: "Accounts, profiles, and first steps in The Gold Collective.", icon: "Sparkles" as const },
  { slug: "account-security", title: "Account & Security", blurb: "Passwords, sessions, and keeping your workspace safe.", icon: "Shield" as const },
  { slug: "booking", title: "Booking", blurb: "Appointments, waitlists, and calendar hygiene.", icon: "Calendar" as const },
  { slug: "payments-tips", title: "Payments & Tips", blurb: "Checkout, tips, gift cards, and payouts.", icon: "CreditCard" as const },
  { slug: "pros", title: "Pros", blurb: "Licensed workflows, menus, and client records.", icon: "Users" as const },
  { slug: "schools", title: "Schools", blurb: "Cohorts, hours, and educator tools.", icon: "GraduationCap" as const },
  { slug: "salons", title: "Salons", blurb: "Multi-chair operations and front-desk calm.", icon: "Store" as const },
  { slug: "fashion", title: "Fashion", blurb: "Castings, portfolios, and showroom rhythm.", icon: "ShoppingBag" as const },
  { slug: "brand-partners", title: "Brand Partners", blurb: "Activations, education, and fair economics.", icon: "Package" as const },
  { slug: "privacy-data", title: "Privacy & Data", blurb: "Consent, exports, and sensitive categories.", icon: "Shield" as const },
  { slug: "verification", title: "Verification", blurb: "Licenses, badges, and trust signals.", icon: "BadgeCheck" as const },
  { slug: "troubleshooting", title: "Troubleshooting", blurb: "When something looks wrong, start here.", icon: "Sparkles" as const },
] as const;

export type HelpCategorySlug = (typeof HELP_CATEGORIES)[number]["slug"];

export function getHelpCategory(slug: string) {
  return HELP_CATEGORIES.find((c) => c.slug === slug);
}
