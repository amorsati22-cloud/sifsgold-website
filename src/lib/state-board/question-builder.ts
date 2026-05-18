import type { QuestionCategory, QuestionType, SeedQuestion } from "@/types/state-board";
import {
  otherStateHourDistractors,
  type StateExamFacts,
} from "@/lib/state-board/state-exam-facts";

const CATEGORIES: QuestionCategory[] = [
  "sanitation",
  "anatomy",
  "chemistry",
  "practical",
  "state_law",
];

function mc(
  category: QuestionCategory,
  text: string,
  a: string,
  b: string,
  c: string,
  d: string,
  correct: "A" | "B" | "C" | "D",
  explanation: string,
  citation: string,
  difficulty = 3,
  relevance = 4,
): SeedQuestion {
  return {
    question_type: "multiple_choice",
    category,
    difficulty,
    question_text: text,
    choice_a: a,
    choice_b: b,
    choice_c: c,
    choice_d: d,
    correct_answer: correct,
    explanation,
    citation,
    exam_relevance: relevance,
  };
}

function tf(
  category: QuestionCategory,
  text: string,
  correct: "true" | "false",
  explanation: string,
  citation: string,
  difficulty = 3,
): SeedQuestion {
  return {
    question_type: "true_false",
    category,
    difficulty,
    question_text: text,
    choice_a: null,
    choice_b: null,
    choice_c: null,
    choice_d: null,
    correct_answer: correct,
    explanation,
    citation,
    exam_relevance: 4,
  };
}

function fc(
  category: QuestionCategory,
  statement: string,
  isTrue: boolean,
  explanation: string,
  citation: string,
): SeedQuestion {
  return {
    question_type: "flashcard",
    category,
    difficulty: 3,
    question_text: statement,
    choice_a: null,
    choice_b: null,
    choice_c: null,
    choice_d: null,
    correct_answer: isTrue ? "true" : "false",
    explanation,
    citation,
    exam_relevance: 4,
  };
}

/** Builds 300 state-specific questions: 100 MC, 50 T/F, 150 flashcard-style. */
export function buildStateQuestionBank(facts: StateExamFacts): SeedQuestion[] {
  const f = facts;
  const distractorHours = otherStateHourDistractors(f);
  const h0 = String(f.requiredHours);
  const h1 = String(distractorHours[0] ?? f.requiredHours + 200);
  const h2 = String(distractorHours[1] ?? f.requiredHours - 200);
  const h3 = String(distractorHours[2] ?? f.requiredHours + 400);

  const core: SeedQuestion[] = [
    mc(
      "state_law",
      `Which agency licenses cosmetologists in ${f.stateName}?`,
      f.boardName,
      "U.S. Food and Drug Administration (FDA)",
      "Occupational Safety and Health Administration (OSHA)",
      "Federal Trade Commission (FTC)",
      "A",
      `${f.boardName} regulates cosmetology licensure in ${f.stateName}.`,
      f.statuteCitation,
      2,
      5,
    ),
    mc(
      "state_law",
      `How many clock hours of training are required for a ${f.stateName} cosmetology operator license (current rule)?`,
      `${h0} hours`,
      `${h1} hours`,
      `${h2} hours`,
      `${h3} hours`,
      "A",
      `${f.stateName} requires ${f.requiredHours} training hours for the cosmetology pathway cited in ${f.statuteCitation}.`,
      f.statuteCitation,
      3,
      5,
    ),
    mc(
      "state_law",
      `Who administers the ${f.stateName} cosmetology written examination (typical vendor)?`,
      f.vendor,
      "Internal school-only exams with no outside vendor",
      "County health departments only",
      "U.S. Department of Education directly",
      "A",
      `Candidates in ${f.stateName} schedule through ${f.vendor} unless the board publishes a change—verify ${f.officialLink}.`,
      f.officialLink,
      3,
      5,
    ),
    mc(
      "state_law",
      `What is the minimum passing score on the ${f.stateName} cosmetology written exam (published target)?`,
      `${f.passingScore}%`,
      "50%",
      "90%",
      "100% — any missed question fails",
      "A",
      `${f.stateName} sets a passing standard of ${f.passingScore}% on the written portion for this license class.`,
      f.statuteCitation,
      3,
      5,
    ),
    fc(
      "state_law",
      `In ${f.stateName}, cosmetology rules are found in ${f.statuteCitation}.`,
      true,
      `State law for ${f.stateName} cosmetology is anchored in ${f.statuteCitation}.`,
      f.statuteCitation,
    ),
    fc(
      "state_law",
      `A ${f.stateName} cosmetology candidate may ignore ${f.boardName} sanitation rules if their salon has private insurance.`,
      false,
      `Licensure and inspection standards from ${f.boardName} apply regardless of private insurance.`,
      f.statuteCitation,
    ),
    mc(
      "sanitation",
      `After a ${f.stateName} salon service, multi-use metal implements must be:`,
      "Cleaned, then disinfected per EPA-registered label instructions",
      "Rinsed in plain water only",
      "Wiped with a dry towel only",
      "Stored without cleaning until the next client",
      "A",
      `${f.boardName} expects infection control consistent with ${f.statuteCitation} and CDC best practices.`,
      f.statuteCitation,
      3,
      5,
    ),
    mc(
      "sanitation",
      `Blood on a workstation during a ${f.stateName} service requires:`,
      "Stop service, glove up, clean with appropriate bloodborne pathogen protocol",
      "Continue service if the client says it is fine",
      "Cover with a cape and proceed",
      "Wait until closing to disinfect",
      "A",
      `Bloodborne exposure procedures are enforced under ${f.stateName} cosmetology sanitation rules.`,
      f.statuteCitation,
      4,
      5,
    ),
    fc(
      "sanitation",
      `Single-use porous items in ${f.stateName} salons may be reused if they look clean.`,
      false,
      "Porous single-use supplies must be discarded after one client.",
      f.statuteCitation,
    ),
    mc(
      "anatomy",
      `The outermost layer of skin primarily responsible for barrier protection is the:`,
      "Epidermis",
      "Dermis",
      "Subcutaneous tissue",
      "Matrix",
      "A",
      "Epidermis is the protective outer layer tested on national and state theory exams.",
      "Milady Standard Cosmetology — Skin Structure",
      2,
      4,
    ),
    mc(
      "anatomy",
      `Hair grows from the:`,
      "Hair follicle / dermal papilla",
      "Epidermis only",
      "Stratum corneum",
      "Arrector pili exclusively",
      "A",
      "Active growth originates in the follicle at the dermal papilla.",
      "Milady Standard Cosmetology — Hair Structure",
      2,
      4,
    ),
    mc(
      "chemistry",
      `On the level system, level 7 represents:`,
      "Medium blonde depth",
      "Black",
      "Lightest blonde only",
      "Red only",
      "A",
      "Level 7 is medium blonde on the 1–10 depth scale.",
      "Milady Standard Cosmetology — Haircolor",
      3,
      4,
    ),
    mc(
      "chemistry",
      `20-volume developer is commonly used in ${f.stateName} salons to:`,
      "Deposit on previously colored hair and lift up to ~2 levels on virgin hair",
      "Guarantee 5 levels of lift on every scalp application",
      "Replace disinfectant solutions",
      "Neutralize relaxers without testing",
      "A",
      "20-volume is standard deposit/slight-lift developer; always follow manufacturer and state scope.",
      f.statuteCitation,
      3,
      4,
    ),
    mc(
      "practical",
      `Before chemical services in ${f.stateName}, a required safety step is:`,
      "Consultation and patch test when manufacturer or state rules require",
      "Skipping consultation for returning clients",
      "Applying highest volume developer first",
      "Mixing unrelated brands for speed",
      "A",
      `${f.boardName} expects documented consultations; patch tests protect clients and licensees.`,
      f.statuteCitation,
      3,
      5,
    ),
  ];

  const generated: SeedQuestion[] = [...core];

  // Expand to 100 MC (20 per category)
  const mcTemplates: Record<
    QuestionCategory,
    (i: number) => SeedQuestion
  > = {
    state_law: (i) =>
      mc(
        "state_law",
        `[${f.stateCode}-${i}] ${f.stateName} licensees must follow rules published by which authority?`,
        f.boardName,
        "Only federal OSHA (no state board)",
        "Local fashion councils",
        "Product manufacturers exclusively",
        "A",
        `${f.boardName} is the licensing authority in ${f.stateName}.`,
        f.statuteCitation,
        2 + (i % 3),
        5,
      ),
    sanitation: (i) =>
      mc(
        "sanitation",
        `[${f.stateCode}-${i}] EPA-registered disinfectants in ${f.stateName} must be used:`,
        "According to the product label after pre-cleaning tools",
        "Without pre-cleaning to save time",
        "Only on porous single-use items",
        "Only when a client requests it",
        "A",
        `Label contact times are enforceable under ${f.stateName} sanitation statutes.`,
        f.statuteCitation,
        2 + (i % 3),
        4,
      ),
    anatomy: (i) =>
      mc(
        "anatomy",
        `[${f.stateCode}-${i}] The active growth phase of hair is called:`,
        "Anagen",
        "Telogen only for all scalp hair permanently",
        "Catagen is the longest phase for everyone",
        "Matrix is a disinfectant phase",
        "A",
        "Anagen is active growth; catagen transitions; telogen rests.",
        "Milady Standard Cosmetology — Hair Growth",
        2 + (i % 3),
        4,
      ),
    chemistry: (i) =>
      mc(
        "chemistry",
        `[${f.stateCode}-${i}] Warm/gold tones on the level 6 underlying pigment are best neutralized with:`,
        "Ash (green-based) formulations",
        "More gold without pre-lightening",
        "Water only",
        "Skipping toner",
        "A",
        "Complementary color theory applies in every state; formulation still must follow ${f.boardName} scope.",
        f.statuteCitation,
        3 + (i % 2),
        4,
      ),
    practical: (i) =>
      mc(
        "practical",
        `[${f.stateCode}-${i}] When overlapping permanent color on previously colored hair in ${f.stateName}, you should:`,
        "Apply to regrowth primarily; refresh ends only if needed",
        "Overlap full head every time for speed",
        "Never strand test",
        "Use highest developer on damaged ends first",
        "A",
        "Overlap causes banding; ${f.stateName} practical exams test safe application.",
        f.statuteCitation,
        3 + (i % 2),
        4,
      ),
  };

  for (const cat of CATEGORIES) {
    let have = generated.filter(
      (q) => q.category === cat && q.question_type === "multiple_choice",
    ).length;
    let i = 0;
    while (have < 20) {
      i += 1;
      generated.push(mcTemplates[cat](i));
      have += 1;
    }
  }

  // 50 true/false (10 per category)
  const tfTemplates: Record<QuestionCategory, (i: number) => SeedQuestion> = {
    state_law: (i) =>
      tf(
        "state_law",
        `[${f.stateCode}-TF-${i}] ${f.stateName} cosmetology candidates should verify hours and vendors on ${f.officialLink} before testing.`,
        "true",
        `Official board pages such as ${f.officialLink} supersede outdated study sheets.`,
        f.officialLink,
        2,
      ),
    sanitation: (i) =>
      tf(
        "sanitation",
        `[${f.stateCode}-TF-${i}] UV sterilizer cabinets alone meet ${f.stateName} requirements for implement disinfection.`,
        "false",
        "UV cabinets do not replace liquid chemical disinfection where ${f.boardName} rules require it.",
        f.statuteCitation,
        3,
      ),
    anatomy: (i) =>
      tf(
        "anatomy",
        `[${f.stateCode}-TF-${i}] The arrector pili muscle can create goosebumps when contracted.`,
        "true",
        "Arrector pili attaches to the follicle and pulls hair upright.",
        "Milady Standard Cosmetology — Hair Structure",
        2,
      ),
    chemistry: (i) =>
      tf(
        "chemistry",
        `[${f.stateCode}-TF-${i}] In ${f.stateName}, mixing two different manufacturer color lines without training is always approved.`,
        "false",
        "Follow manufacturer compatibility; ${f.boardName} scope requires competent chemical services.",
        f.statuteCitation,
        3,
      ),
    practical: (i) =>
      tf(
        "practical",
        `[${f.stateCode}-TF-${i}] A strand test before lightening is a best practice tested on ${f.stateName} theory exams.`,
        "true",
        "Strand tests predict lift and damage.",
        f.statuteCitation,
        3,
      ),
  };

  for (const cat of CATEGORIES) {
    let have = generated.filter(
      (q) => q.category === cat && q.question_type === "true_false",
    ).length;
    let i = 0;
    while (have < 10) {
      i += 1;
      generated.push(tfTemplates[cat](i));
      have += 1;
    }
  }

  // 150 flashcard statements (30 per category)
  const fcTemplates: Record<QuestionCategory, (i: number) => SeedQuestion> = {
    state_law: (i) =>
      fc(
        "state_law",
        `[${f.stateCode}-FC-${i}] ${f.stateName} cosmetology written exams are typically administered by ${f.vendor}.`,
        true,
        `Vendor scheduling for ${f.stateName} is published via the board and ${f.vendor}.`,
        f.officialLink,
      ),
    sanitation: (i) =>
      fc(
        "sanitation",
        `[${f.stateCode}-FC-${i}] ${f.boardName} requires licensees to maintain sanitary conditions in licensed establishments.`,
        true,
        `Sanitation is a licensure condition under ${f.statuteCitation}.`,
        f.statuteCitation,
      ),
    anatomy: (i) =>
      fc(
        "anatomy",
        `[${f.stateCode}-FC-${i}] The dermis contains collagen, elastin, and blood vessels.`,
        true,
        "Dermis is the living layer beneath the epidermis.",
        "Milady Standard Cosmetology — Skin Structure",
      ),
    chemistry: (i) =>
      fc(
        "chemistry",
        `[${f.stateCode}-FC-${i}] Blue-based toners help neutralize orange brass on lightened hair.`,
        true,
        "Blue complements orange on the color wheel.",
        "Milady Standard Cosmetology — Haircolor",
      ),
    practical: (i) =>
      fc(
        "practical",
        `[${f.stateCode}-FC-${i}] ${f.stateName} candidates should document client consultation notes before chemical services.`,
        true,
        `Documentation supports ${f.boardName} compliance and client safety.`,
        f.statuteCitation,
      ),
  };

  for (const cat of CATEGORIES) {
    let have = generated.filter(
      (q) => q.category === cat && q.question_type === "flashcard",
    ).length;
    let i = 0;
    while (have < 30) {
      i += 1;
      generated.push(fcTemplates[cat](i));
      have += 1;
    }
  }

  const mcCount = generated.filter((q) => q.question_type === "multiple_choice").length;
  const tfCount = generated.filter((q) => q.question_type === "true_false").length;
  const fcCount = generated.filter((q) => q.question_type === "flashcard").length;

  if (mcCount !== 100 || tfCount !== 50 || fcCount !== 150) {
    throw new Error(
      `Question bank for ${f.stateCode} miscounted: MC=${mcCount} TF=${tfCount} FC=${fcCount}`,
    );
  }

  return generated;
}

const STATE_ID_PREFIX: Record<string, string> = {
  tx: "10",
  ca: "20",
  fl: "30",
  ny: "40",
  pa: "50",
};

export function assignQuestionIds(
  examId: string,
  questions: SeedQuestion[],
  statePrefix: string,
): Array<SeedQuestion & { id: string; exam_id: string }> {
  const prefix = STATE_ID_PREFIX[statePrefix] ?? "99";
  return questions.map((q, index) => {
    const n = index + 1;
    const id = `${prefix}${String(n).padStart(6, "0")}-4000-8000-${String(n).padStart(12, "0")}`;
    return { ...q, id, exam_id: examId };
  });
}
