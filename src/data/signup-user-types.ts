import type { LucideIcon } from "lucide-react";
import {
  Award,
  Building2,
  GraduationCap,
  Handshake,
  School,
  Shirt,
  Store,
  User,
} from "lucide-react";

export type SignupUserTypeSlug =
  | "student"
  | "licensed-pro"
  | "salon-studio"
  | "beauty-fitness-school"
  | "fashion-industry"
  | "storefront-brand"
  | "brand-partner"
  | "client";

export type SignupUserTypeOption = {
  slug: SignupUserTypeSlug;
  label: string;
  description: string;
  Icon: LucideIcon;
};

export const SIGNUP_USER_TYPE_OPTIONS: SignupUserTypeOption[] = [
  {
    slug: "student",
    label: "Student",
    description: "Programs, mentors, and bookings in one place.",
    Icon: GraduationCap,
  },
  {
    slug: "licensed-pro",
    label: "Licensed Pro",
    description: "Independent artists and certified practitioners.",
    Icon: Award,
  },
  {
    slug: "salon-studio",
    label: "Salon or Studio",
    description: "Teams, chairs, and retail under one roof.",
    Icon: Building2,
  },
  {
    slug: "beauty-fitness-school",
    label: "Beauty or Fitness School",
    description: "Curriculum, placements, and graduate pipelines.",
    Icon: School,
  },
  {
    slug: "fashion-industry",
    label: "Fashion Industry",
    description: "Runway, editorial, and commercial workflows.",
    Icon: Shirt,
  },
  {
    slug: "storefront-brand",
    label: "Storefront or Brand",
    description: "Retail lines and owned experiences.",
    Icon: Store,
  },
  {
    slug: "brand-partner",
    label: "Brand Partner",
    description: "Campaigns, collabs, and compliant partnerships.",
    Icon: Handshake,
  },
  {
    slug: "client",
    label: "Client",
    description: "Book, shop, and follow the people you trust.",
    Icon: User,
  },
];

export function labelForSignupUserTypeSlug(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const hit = SIGNUP_USER_TYPE_OPTIONS.find((o) => o.slug === slug);
  return hit?.label ?? null;
}
