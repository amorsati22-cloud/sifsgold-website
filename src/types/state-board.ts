export type ProgramType = "cosmetology" | "barbering" | "esthetics" | "nail_tech";

export type QuestionType = "multiple_choice" | "true_false" | "flashcard";

export type QuestionCategory =
  | "sanitation"
  | "anatomy"
  | "chemistry"
  | "practical"
  | "state_law";

export type ContentStatus = "draft" | "published" | "archived";

export type StateBoardExam = {
  id: string;
  state: string;
  program_type: ProgramType;
  exam_name: string;
  vendor: string;
  total_questions: number;
  passing_score: number;
  time_limit_minutes: number;
  required_hours: number;
  statute_citation: string;
  board_name: string;
  official_link: string;
  last_updated: string;
  content_status: ContentStatus;
};

export type Question = {
  id: string;
  exam_id: string;
  question_type: QuestionType;
  category: QuestionCategory;
  difficulty: number;
  question_text: string;
  choice_a: string | null;
  choice_b: string | null;
  choice_c: string | null;
  choice_d: string | null;
  correct_answer: string;
  explanation: string;
  citation: string | null;
  exam_relevance: number;
  created_at?: string;
};

export type PracticeTestAttempt = {
  id: string;
  user_id: string;
  exam_id: string;
  started_at: string;
  completed_at: string | null;
  time_elapsed_seconds: number | null;
  questions_answered: number | null;
  correct_count: number | null;
  score_percent: number | null;
  passed: boolean | null;
  category_breakdown: Record<string, number> | null;
};

export type UserQuestionHistory = {
  id: string;
  user_id: string;
  question_id: string;
  answered_correctly: boolean;
  time_to_answer_seconds: number | null;
  attempted_at: string;
  attempt_number: number;
};

export type QuizMode = "quick" | "category" | "full";

export type ExamWithStats = StateBoardExam & {
  bestScorePercent: number | null;
  attemptCount: number;
};

export type StateBoardProgress = {
  exams: ExamWithStats[];
  selectedExam: StateBoardExam | null;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  categoryMastery: { category: string; percent: number }[];
  weakestCategory: QuestionCategory | null;
  readinessPercent: number;
  streakDays: number;
};

export type SeedQuestion = Omit<Question, "id" | "exam_id" | "created_at"> & {
  id?: string;
};
