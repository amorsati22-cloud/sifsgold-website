export type StartingPoint =
  | "high_school"
  | "career_change"
  | "currently_licensed"
  | "experienced_pro";

export type EndRole =
  | "salon_owner"
  | "platform_artist"
  | "educator"
  | "celebrity_stylist";

export type RoleCategory =
  | "hair"
  | "skin"
  | "nails"
  | "lashes"
  | "massage"
  | "tattoo"
  | "business";

export type CareerPath = {
  id: string;
  starting_point: StartingPoint;
  end_role: EndRole;
  name: string;
  description: string;
  estimated_total_years: number;
  estimated_total_investment: number;
  order_index: number;
};

export type CareerMilestone = {
  id: string;
  path_id: string;
  milestone_order: number;
  name: string;
  description: string;
  estimated_duration_months: number;
  estimated_cost: number;
  requirements: string[];
  typical_outcomes: string[];
};

export type CareerRole = {
  id: string;
  name: string;
  category: RoleCategory;
  description: string;
  median_annual_salary: number;
  salary_range_low: number;
  salary_range_high: number;
  bls_source_link: string;
  salary_data_year: number;
  required_license_types: string[];
  required_education: string;
  typical_continuing_education: string;
  specialty_certifications: string[];
  career_advancement: string;
  icon: string;
};

export type CareerPathRole = {
  path_id: string;
  role_id: string;
  milestone_order: number;
};

export type UserCareerInterests = {
  id: string;
  interested_roles: string[];
  starting_point: StartingPoint | null;
  target_role: string | null;
  saved_path_id: string | null;
  milestone_progress: Record<string, boolean>;
  created_at: string;
};

export type PathWithDetails = CareerPath & {
  milestones: CareerMilestone[];
  roles: (CareerRole & { milestone_order: number })[];
};
