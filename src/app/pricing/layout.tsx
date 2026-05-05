import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Sif's Gold",
  description:
    "Simple, transparent pricing for students, professionals, clients, schools, salons, storefronts, brands, and fashion — free to start.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
