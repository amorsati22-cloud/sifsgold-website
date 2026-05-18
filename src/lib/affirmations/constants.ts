import type { AffirmationAudience, AffirmationCategory } from "@/types/affirmations";

export const CATEGORY_LABELS: Record<AffirmationCategory, string> = {
  self_worth: "Self-worth",
  craft_pride: "Craft pride",
  client_care: "Client care",
  rest_recovery: "Rest & recovery",
  abundance: "Abundance",
};

export const AUDIENCE_LABELS: Record<AffirmationAudience, string> = {
  pros: "Professionals",
  clients: "Clients",
  students: "Students",
};

export const REPEAT_WINDOW_DAYS = 30;
