import type { ProgramType, QuestionCategory } from "@/types/state-board";

export const PUBLISHED_STATE_CODES = ["TX", "CA", "FL", "NY", "PA"] as const;

export type PublishedStateCode = (typeof PUBLISHED_STATE_CODES)[number];

export const SLUG_TO_STATE_CODE: Record<string, string> = {
  tx: "TX",
  ca: "CA",
  fl: "FL",
  ny: "NY",
  pa: "PA",
};

export const STATE_CODE_TO_SLUG: Record<string, string> = {
  TX: "tx",
  CA: "ca",
  FL: "fl",
  NY: "ny",
  PA: "pa",
};

export const PROGRAM_LABELS: Record<ProgramType, string> = {
  cosmetology: "Cosmetology",
  barbering: "Barbering",
  esthetics: "Esthetics",
  nail_tech: "Nail technology",
};

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  sanitation: "Sanitation & safety",
  anatomy: "Anatomy & physiology",
  chemistry: "Chemistry & color",
  practical: "Practical theory",
  state_law: "State law & rules",
};

export const QUICK_QUIZ_COUNT = 10;
export const CATEGORY_QUIZ_COUNT = 20;
export const FULL_EXAM_QUESTION_COUNT = 100;

export const EXAM_IDS: Record<PublishedStateCode, string> = {
  TX: "e1000001-0001-4001-8001-000000000001",
  CA: "e2000001-0002-4002-8002-000000000002",
  FL: "e3000001-0003-4003-8003-000000000003",
  NY: "e4000001-0004-4004-8004-000000000004",
  PA: "e5000001-0005-4005-8005-000000000005",
};
