export type ProgramType =
  | "cosmetology"
  | "barbering"
  | "esthetics"
  | "nail_tech"
  | "massage"
  | "tattoo"
  | "piercing";

export type StudyLevel = "beginner" | "intermediate" | "advanced";

export type MasteryLevel = "new" | "learning" | "familiar" | "mastered";

export type StudyGrade = "again" | "hard" | "good" | "easy";

export type StudyGuide = {
  id: string;
  name: string;
  program_type: ProgramType;
  state: string | null;
  level: StudyLevel;
  description: string | null;
  cover_image_url: string | null;
  total_cards: number;
  estimated_hours: number;
  order_index: number;
  created_by: string | null;
  public: boolean;
};

export type FlashcardDeck = {
  id: string;
  study_guide_id: string;
  name: string;
  description: string | null;
  order_index: number;
  card_count: number;
};

export type Flashcard = {
  id: string;
  deck_id: string;
  front_text: string;
  back_text: string;
  image_url: string | null;
  mnemonics: string | null;
  exam_relevance: number;
  order_index: number;
};

export type UserCardProgress = {
  id: string;
  user_id: string;
  card_id: string;
  review_count: number;
  correct_count: number;
  incorrect_count: number;
  last_reviewed_at: string | null;
  next_due_at: string | null;
  easiness_factor: number;
  interval_days: number;
  mastery_level: MasteryLevel;
};

export type StudySession = {
  id: string;
  user_id: string;
  deck_id: string;
  started_at: string;
  ended_at: string | null;
  cards_reviewed: number | null;
  correct_count: number | null;
  session_duration_seconds: number | null;
};

export type UserStudyStreak = {
  id: string;
  current_streak_days: number;
  longest_streak_days: number;
  last_study_date: string | null;
  total_study_minutes: number;
  total_cards_mastered: number;
};

export type StudyGuideWithProgress = StudyGuide & {
  progressPercent: number;
  masteredCount: number;
};

export type DeckWithProgress = FlashcardDeck & {
  progressPercent: number;
  masteredCount: number;
  dueCount: number;
  locked: boolean;
};

export type StudyAnalytics = {
  streak: UserStudyStreak | null;
  dueTodayCount: number;
  masteryByDeck: { name: string; mastered: number; total: number }[];
};
