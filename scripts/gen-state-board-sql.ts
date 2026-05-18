import { writeFileSync } from "fs";
import { join } from "path";
import { PUBLISHED_EXAM_SEEDS, TOTAL_PUBLISHED_QUESTIONS } from "../src/lib/state-board/seed-content";

function esc(s: string) {
  return s.replace(/'/g, "''");
}

const examRows = PUBLISHED_EXAM_SEEDS.map(
  ({ exam }) =>
    `  ('${exam.id}'::uuid, '${exam.state}', '${exam.program_type}', '${esc(exam.exam_name)}', '${esc(exam.vendor)}', ${exam.total_questions}, ${exam.passing_score}, ${exam.time_limit_minutes}, ${exam.required_hours}, '${esc(exam.statute_citation)}', '${esc(exam.board_name)}', '${esc(exam.official_link)}', '${exam.last_updated}'::date, '${exam.content_status}')`,
).join(",\n");

const questionRows: string[] = [];
for (const { questions } of PUBLISHED_EXAM_SEEDS) {
  for (const q of questions) {
    const ca = q.choice_a ? `'${esc(q.choice_a)}'` : "NULL";
    const cb = q.choice_b ? `'${esc(q.choice_b)}'` : "NULL";
    const cc = q.choice_c ? `'${esc(q.choice_c)}'` : "NULL";
    const cd = q.choice_d ? `'${esc(q.choice_d)}'` : "NULL";
    const cit = q.citation ? `'${esc(q.citation)}'` : "NULL";
    questionRows.push(
      `  ('${q.id}'::uuid, '${q.exam_id}'::uuid, '${q.question_type}', '${q.category}', ${q.difficulty}, '${esc(q.question_text)}', ${ca}, ${cb}, ${cc}, ${cd}, '${q.correct_answer}', '${esc(q.explanation)}', ${cit}, ${q.exam_relevance})`,
    );
  }
}

const sql = `-- Auto-generated (${TOTAL_PUBLISHED_QUESTIONS} questions). Run: npx tsx scripts/gen-state-board-sql.ts

INSERT INTO public.state_board_exams (
  id, state, program_type, exam_name, vendor, total_questions, passing_score,
  time_limit_minutes, required_hours, statute_citation, board_name, official_link,
  last_updated, content_status
) VALUES
${examRows}
ON CONFLICT (id) DO UPDATE SET
  total_questions = EXCLUDED.total_questions,
  content_status = EXCLUDED.content_status,
  last_updated = EXCLUDED.last_updated;

INSERT INTO public.questions (
  id, exam_id, question_type, category, difficulty, question_text,
  choice_a, choice_b, choice_c, choice_d, correct_answer, explanation, citation, exam_relevance
) VALUES
${questionRows.join(",\n")}
ON CONFLICT (id) DO NOTHING;
`;

writeFileSync(join(__dirname, "..", "schema-state-board-seeds.generated.sql"), sql);
console.log(`Wrote ${TOTAL_PUBLISHED_QUESTIONS} questions`);
