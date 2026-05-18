export type AffirmationCategory =
  | "self_worth"
  | "craft_pride"
  | "client_care"
  | "rest_recovery"
  | "abundance";

export type AffirmationAudience = "pros" | "clients" | "students";

export type AffirmationSeason = "winter" | "spring" | "summer" | "fall" | null;

export type DailyAffirmation = {
  id: string;
  text: string;
  category: AffirmationCategory;
  target_audience: AffirmationAudience[];
  season: AffirmationSeason;
  active: boolean;
  created_at?: string;
};

export type UserAffirmationHistory = {
  id: string;
  user_id: string;
  affirmation_id: string;
  shown_at: string;
  saved: boolean;
  shared_to_platform: string | null;
};

export type BodyZoneId = "head" | "face" | "hair" | "neck" | "hands" | "body" | "feet" | "nails";

export type BeautyBodyZone = {
  id: BodyZoneId;
  name: string;
  description: string;
  icon_svg: string | null;
};

export type BeautyBodyService = {
  id: string;
  zone_id: BodyZoneId;
  service_name: string;
  description: string;
  category: string;
  average_duration_minutes: number;
  average_price_range: string;
  finding_pros_filter: {
    serviceCategories?: string[];
    specialties?: string[];
    searchTerms?: string[];
  };
  what_to_expect?: string;
  prep_tips?: string;
  aftercare?: string;
};
