export type BookStatus = "fully_open" | "request_only" | "closed" | "exclusive";

export type ProProfile = {
  id: string;
  username: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  specialties: string[] | null;
  license_state: string | null;
  license_verified: boolean;
  license_expiry: string | null;
  years_experience: number | null;
  languages_spoken: string[] | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  pinterest_handle: string | null;
  website_url: string | null;
  book_status: BookStatus;
  accepting_new_clients: boolean;
  visible_in_search: boolean;
  pronouns: string | null;
  accessibility_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PortfolioItem = {
  id: string;
  pro_id: string;
  category: string;
  image_url: string;
  thumb_url: string | null;
  caption: string | null;
  alt_text: string;
  service_type: string | null;
  before_image_url: string | null;
  featured: boolean;
  display_order: number | null;
  created_at: string;
  tags: string[] | null;
};

/** @deprecated Import Service / ServiceWithAddons from @/types/services */
export type { Service as ProService, ServiceWithAddons } from "@/types/services";

export type Credential = {
  id: string;
  pro_id: string;
  type: "license" | "certification" | "continuing_education" | "award";
  name: string;
  issuing_authority: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_number: string | null;
  verification_url: string | null;
  public: boolean;
};

export type Testimonial = {
  id: string;
  pro_id: string;
  client_name: string | null;
  rating: number;
  text: string;
  pro_reply: string | null;
  service_id: string | null;
  created_at: string;
  featured: boolean;
};

export const PORTFOLIO_CATEGORIES = [
  "color",
  "cut",
  "updo",
  "extensions",
  "makeup_bridal",
  "makeup_everyday",
  "skincare",
  "nails",
  "barbering",
  "fitness",
  "fashion",
  "other",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export function formatPortfolioCategory(category: string): string {
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
