import { EXAM_IDS } from "@/lib/state-board/constants";
import {
  assignQuestionIds,
  buildStateQuestionBank,
} from "@/lib/state-board/question-builder";
import { STATE_EXAM_FACTS } from "@/lib/state-board/state-exam-facts";
import type { SeedQuestion } from "@/types/state-board";

const facts = STATE_EXAM_FACTS.TX;
const examId = EXAM_IDS.TX;

export const TEXAS_COSMETOLOGY_EXAM = {
  id: examId,
  state: facts.stateCode,
  program_type: facts.programType,
  exam_name: facts.examName,
  vendor: facts.vendor,
  total_questions: 300,
  passing_score: facts.passingScore,
  time_limit_minutes: facts.timeLimitMinutes,
  required_hours: facts.requiredHours,
  statute_citation: facts.statuteCitation,
  board_name: facts.boardName,
  official_link: facts.officialLink,
  last_updated: facts.lastUpdated,
  content_status: "published" as const,
};

const bank = buildStateQuestionBank(facts);

export const TEXAS_COSMETOLOGY_QUESTIONS: Array<SeedQuestion & { id: string; exam_id: string }> =
  assignQuestionIds(examId, bank, "tx");
