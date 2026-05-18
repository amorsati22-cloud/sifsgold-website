import type { ToolDefinition, ToolSlug } from "@/types/tools";

export const TOOLS: ToolDefinition[] = [
  {
    slug: "tip-calculator",
    name: "Tip calculator",
    description: "Split gratuity across team members with preset percentages.",
    icon: "Coins",
    category: "money",
  },
  {
    slug: "color-formula",
    name: "Color formula",
    description: "Mixing ratios and processing time by developer volume.",
    icon: "Palette",
    category: "chemistry",
  },
  {
    slug: "dilution-calculator",
    name: "Dilution calculator",
    description: "Dilute peroxide, bleach, and color to target strength.",
    icon: "FlaskConical",
    category: "chemistry",
  },
  {
    slug: "appointment-roi",
    name: "Appointment ROI",
    description: "Net profit per hour for a service — compare your menu.",
    icon: "TrendingUp",
    category: "money",
  },
  {
    slug: "booth-rent-calculator",
    name: "Booth rent vs commission",
    description: "Breakeven between monthly rent and commission splits.",
    icon: "Building2",
    category: "business",
  },
  {
    slug: "pricing-strategy",
    name: "Pricing strategy",
    description: "Market range and starting price by experience and location.",
    icon: "Tag",
    category: "money",
  },
  {
    slug: "timing-calculator",
    name: "Timing calculator",
    description: "Stack services, add-ons, and buffer for block booking.",
    icon: "Clock",
    category: "business",
  },
  {
    slug: "inventory-cost",
    name: "Inventory cost",
    description: "Product cost per service and markup suggestions.",
    icon: "Package",
    category: "business",
  },
  {
    slug: "state-board-countdown",
    name: "State board countdown",
    description: "Days until exam with daily study targets.",
    icon: "GraduationCap",
    category: "education",
  },
  {
    slug: "license-renewal-tracker",
    name: "License renewal tracker",
    description: "Expiration countdown and CE hours by state.",
    icon: "BadgeCheck",
    category: "education",
  },
  {
    slug: "business-tax-estimator",
    name: "Business tax estimator",
    description: "Quarterly self-employment tax estimate (not tax advice).",
    icon: "Calculator",
    category: "money",
  },
  {
    slug: "social-media-scheduler",
    name: "Social post planner",
    description: "Best times to post and caption drafts in brand voice.",
    icon: "Share2",
    category: "marketing",
  },
];

export function getTool(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export const TOOL_SLUGS = TOOLS.map((t) => t.slug) as ToolSlug[];
