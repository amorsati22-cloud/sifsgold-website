import type { ProgramType } from "@/types/study-guides";

export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  cosmetology: "Cosmetology",
  barbering: "Barbering",
  esthetics: "Esthetics",
  nail_tech: "Nail technology",
  massage: "Massage",
  tattoo: "Tattoo",
  piercing: "Piercing",
};

export const DECK_UNLOCK_THRESHOLD = 0.8;

export const STUDY_GRADE_LABELS = {
  again: { label: "Again", color: "bg-red-600 hover:bg-red-500" },
  hard: { label: "Hard", color: "bg-orange-600 hover:bg-orange-500" },
  good: { label: "Good", color: "bg-emerald-600 hover:bg-emerald-500" },
  easy: { label: "Easy", color: "bg-sky-600 hover:bg-sky-500" },
} as const;
