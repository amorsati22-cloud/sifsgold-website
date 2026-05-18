/**
 * Study guide seed metadata — mirrors schema-study-guides.sql inserts.
 * Flashcard copy targets state board theory (sanitation, color, anatomy).
 */

import { SEED_DECK_IDS, SEED_GUIDE_IDS } from "@/lib/study-guides/seed-ids";
import type { ProgramType } from "@/types/study-guides";

export type SeedCard = {
  front: string;
  back: string;
  examRelevance: number;
  mnemonic?: string;
};

export type SeedDeck = {
  id: string;
  guideId: string;
  name: string;
  description: string;
  orderIndex: number;
  cards: SeedCard[];
};

export type SeedGuide = {
  id: string;
  name: string;
  programType: ProgramType;
  state: string;
  description: string;
  estimatedHours: number;
  orderIndex: number;
  decks: Omit<SeedDeck, "guideId">[];
};

function cards(
  items: [string, string, number?, string?][],
): SeedCard[] {
  return items.map(([front, back, examRelevance = 4, mnemonic]) => ({
    front,
    back,
    examRelevance: examRelevance ?? 4,
    mnemonic,
  }));
}

const TX_SANITATION = cards([
  [
    "Which Texas agency licenses cosmetologists?",
    "Texas Department of Licensing and Regulation (TDLR) — verify current rules on TDLR.texas.gov before your exam.",
    5,
    "TDLR = Texas licenses",
  ],
  [
    "Texas cosmetology written exam vendor (typical)?",
    "NIC (National-Interstate Council) examinations are commonly used — confirm your school’s candidate handbook.",
    5,
  ],
  [
    "EPA-registered disinfectant contact time on pre-cleaned implements?",
    "Follow the product label exactly — most require 10 minutes wet contact on a clean, dry surface.",
    5,
  ],
  [
    "When must you wash hands in Texas practice?",
    "Before each client, after restroom use, when visibly soiled, and before/after gloves if used.",
    4,
  ],
  [
    "Blood exposure on a work surface — first step?",
    "Stop service, put on gloves, block off area, clean with EPA-registered bloodborne pathogen cleaner per label.",
    5,
  ],
  [
    "Multi-use metal tools after a haircut — minimum process?",
    "Remove debris, wash with detergent, rinse, dry, then immerse in EPA-registered disinfectant for label time.",
    5,
  ],
  [
    "Single-use porous items (neck strips, cotton) after one client?",
    "Discard immediately — never reuse on another client.",
    5,
  ],
  [
    "UV sterilizer (cabinet) — acceptable alone for implements?",
    "No — UV cabinets are not a substitute for liquid chemical disinfection or sterilization where required.",
    4,
  ],
  [
    "Texas booth rental — who maintains sanitation logs?",
    "The license holder performing services is responsible for their station, tools, and disinfectant records.",
    3,
  ],
  [
    "Disinfectant solution strength — how do you maintain it?",
    "Mix fresh per manufacturer directions; change when visibly dirty or per label — never “top off” indefinitely.",
    4,
  ],
  [
    "Contact dermatitis from disinfectant — best action?",
    "Switch to compatible gloves, improve ventilation, use labeled product; seek medical care if severe.",
    3,
  ],
  [
    "Foot spa basin — between clients?",
    "Drain, scrub, rinse, disinfect per manufacturer; log if your salon policy requires.",
    5,
  ],
  [
    "Sharps (lancets, needles) in Texas cosmetology scope?",
    "Only if your license and training authorize — never discard loose in trash; use sharps container.",
    4,
  ],
  [
    "Client with open wound on scalp — what should you do?",
    "Do not perform chemical services; postpone or refer; document refusal if needed.",
    4,
  ],
  [
    "Material Safety Data Sheet / SDS — purpose?",
    "Explains hazards, PPE, first aid for salon chemicals — keep accessible per OSHA expectations.",
    3,
  ],
  [
    "Clean vs. sanitized vs. sterilized?",
    "Clean = soil removed; sanitized = pathogens reduced on surfaces; sterilized = destruction of all microbial life (autoclave).",
    5,
  ],
  [
    "Texas cosmetology hour total (verify before testing)?",
    "Program hours are set by TDLR rule — schools publish current totals (often 1,000 hours for operator; confirm with TDLR).",
    4,
  ],
]);

const TX_COLOR = cards([
  [
    "Level system on hair color box — what does “7” mean?",
    "Medium blonde depth on the 1–10 scale (1 black, 10 lightest blonde).",
    5,
  ],
  [
    "Underlying pigment at level 6 (light brown)?",
    "Red-orange — explains why ash formulas can look muddy without pre-lightening.",
    4,
  ],
  [
    "Developer 20 volume — typical use?",
    "Up to 2 levels lift on scalp, deposit on previously colored hair, gray coverage with permanent color.",
    5,
  ],
  [
    "Developer 30 volume — caution?",
    "More lift and potential damage; not default on scalp for fine or previously lightened hair.",
    4,
  ],
  [
    "Equal parts color + 20 vol on regrowth only — why?",
    "Controls heat from scalp, targets new growth without over-processing mids/ends.",
    4,
  ],
  [
    "Patch test wait time (standard)?",
    "48 hours before full application when manufacturer or state rule requires.",
    5,
  ],
  [
    "Warm tone neutralized by?",
    "Ash / green-based toners on the color wheel (opposite complements).",
    4,
  ],
  [
    "Brassy orange after bleach — first toner choice?",
    "Blue-based ash toner (blue cancels orange on the wheel).",
    5,
  ],
  [
    "Porosity test — hair floats quickly?",
    "High porosity — absorbs fast, may look dull; use lower developer, fillers, or protein treatments.",
    4,
  ],
  [
    "Demi-permanent vs. permanent?",
    "Demi deposits with low/no lift, fades off; permanent uses alkalizer, lifts, and leaves lasting pigment.",
    5,
  ],
  [
    "Fillers before fashion vivids on level 10?",
    "Replace missing gold/orange stages so direct dye adheres evenly.",
    3,
  ],
  [
    "Texas law — who can mix professional color?",
    "Licensed cosmetologists (or students under instructor) — not unlicensed assistants alone.",
    3,
  ],
  [
    "Overlapping permanent color on previously colored hair?",
    "Causes banding and breakage — apply to regrowth only, refresh ends with gloss if needed.",
    5,
  ],
  [
    "pH of hydroxide relaxer?",
    "Very high (alkaline) — swells cuticle, breaks disulfide bonds; requires neutralizer after.",
    4,
  ],
  [
    "Strand test purpose before lightening?",
    "Predict lift, damage, and timing — mandatory on compromised hair.",
    5,
  ],
  [
    "Green cast on pool hair — remove with?",
    "Red-based shampoo or chelating treatment (complementary to green).",
    3,
  ],
  [
    "Consultation question for color correction?",
    "History: box color, henna, relaxer, meds, last lightening — all affect outcome.",
    5,
  ],
]);

const TX_ANATOMY = cards([
  [
    "Epidermis function for esthetics/cosmetology?",
    "Outermost layer — protection, melanin production, cell turnover.",
    4,
  ],
  [
    "Dermis contains?",
    "Collagen, elastin, blood vessels, nerves, hair follicles, sweat/oil glands.",
    4,
  ],
  [
    "Arrector pili muscle — effect?",
    "Pulls hair upright (“goosebumps”) when cold or frightened.",
    3,
  ],
  [
    "Hair growth phase — longest?",
    "Anagen (active growth) — can last years on scalp.",
    5,
  ],
  [
    "Catagen phase?",
    "Short transition — follicle shrinks, detaches from dermal papilla.",
    4,
  ],
  [
    "Telogen phase?",
    "Resting — club hair sheds, new anagen begins.",
    4,
  ],
  [
    "Chemical hair bond broken by permanent wave solution?",
    "Disulfide bonds — reshaped on rods, reformed with neutralizer.",
    5,
  ],
  [
    "Hydrogen bonds in hair?",
    "Weak, broken by water/heat — explain blow-dry styling and humidity frizz.",
    4,
  ],
  [
    "Oval follicle produces?",
    "Wavy hair cross-section.",
    3,
  ],
  [
    "Flat follicle produces?",
    "Straight, coarse hair typical of many Asian hair types.",
    3,
  ],
  [
    "Round follicle produces?",
    "Straight, finer strands common in many European hair types.",
    3,
  ],
  [
    "Nail plate growth zone?",
    "Matrix under proximal nail fold — damage here affects permanent nail shape.",
    4,
  ],
  [
    "Onycholysis?",
    "Separation of nail plate from bed — avoid aggressive filing; refer if infection suspected.",
    4,
  ],
  [
    "Contraindication for chemical relaxer?",
    "Scalp abrasion, active infection, previous incompatible chemical service same day.",
    5,
  ],
  [
    "Bacteria vs. virus — salon relevance?",
    "Bacteria on tools/surfaces (disinfect); viruses like bloodborne pathogens need barrier precautions.",
    4,
  ],
  [
    "Cocci bacteria shape?",
    "Round clusters/chains — common skin flora; sanitation prevents spread.",
    3,
  ],
]);

const CA_SANITATION = TX_SANITATION.map((c, i) =>
  i === 0
    ? {
        front: "Which California agency regulates cosmetology?",
        back: "Board of Barbering and Cosmetology (BBC) — rules at barbercosmo.ca.gov.",
        examRelevance: 5,
        mnemonic: "BBC = California board",
      }
    : i === 1
      ? {
          front: "California cosmetologist training hours (verify current)?",
          back: "BBC programs typically require 1,600 hours for cosmetologist licensure — confirm with your school.",
          examRelevance: 5,
        }
      : i === 16
        ? {
            front: "California disinfectant — acceptable types?",
            back: "EPA-registered bactericidal, virucidal, fungicidal disinfectants used per label on pre-cleaned tools.",
            examRelevance: 5,
          }
        : c,
);

const CA_COLOR = TX_COLOR.map((c, i) =>
  i === 11
    ? {
        front: "California — who may perform hair coloring?",
        back: "Licensed cosmetologists or barbers within scope; estheticians only where BBC scope allows.",
        examRelevance: 4,
      }
    : c,
);

const CA_ANATOMY = TX_ANATOMY;

const FL_SANITATION = TX_SANITATION.map((c, i) =>
  i === 0
    ? {
        front: "Which Florida department licenses cosmetology?",
        back: "Florida DBPR — Cosmetology program under Division of Professions.",
        examRelevance: 5,
        mnemonic: "DBPR Florida",
      }
    : i === 1
      ? {
          front: "Florida cosmetology exam vendor (typical)?",
          back: "NIC or PSI depending on license type — use your candidate handbook.",
          examRelevance: 5,
        }
      : i === 16
        ? {
            front: "Florida cosmetology program hours (verify)?",
            back: "Full cosmetology programs are commonly 1,200 clock hours — confirm with DBPR and your school.",
            examRelevance: 4,
          }
        : c,
);

const FL_COLOR = TX_COLOR.map((c, i) =>
  i === 11
    ? {
        front: "Florida — chemical service documentation?",
        back: "Maintain client consultation records; follow DBPR sanitation and scope rules for chemical services.",
        examRelevance: 3,
      }
    : c,
);

const FL_ANATOMY = TX_ANATOMY;

export const SEED_GUIDES: SeedGuide[] = [
  {
    id: SEED_GUIDE_IDS.texas,
    name: "Texas Cosmetology Theory",
    programType: "cosmetology",
    state: "TX",
    description:
      "TDLR-focused theory: sanitation, hair color, anatomy, and NIC-style written prep for Texas operator candidates.",
    estimatedHours: 8,
    orderIndex: 1,
    decks: [
      {
        id: SEED_DECK_IDS.txSanitation,
        name: "Sanitation Basics",
        description: "Infection control, disinfection, and Texas scope rules.",
        orderIndex: 1,
        cards: TX_SANITATION,
      },
      {
        id: SEED_DECK_IDS.txColor,
        name: "Hair Color Theory",
        description: "Level, tone, developers, and corrective color fundamentals.",
        orderIndex: 2,
        cards: TX_COLOR,
      },
      {
        id: SEED_DECK_IDS.txAnatomy,
        name: "Anatomy & Physiology",
        description: "Skin, hair, nails, and microbiology for state board.",
        orderIndex: 3,
        cards: TX_ANATOMY,
      },
    ],
  },
  {
    id: SEED_GUIDE_IDS.california,
    name: "California Cosmetology Theory",
    programType: "cosmetology",
    state: "CA",
    description:
      "BBC-aligned theory decks with California hours, scope, and sanitation emphasis.",
    estimatedHours: 8,
    orderIndex: 2,
    decks: [
      {
        id: SEED_DECK_IDS.caSanitation,
        name: "Sanitation Basics",
        description: "BBC infection control and workstation standards.",
        orderIndex: 1,
        cards: CA_SANITATION,
      },
      {
        id: SEED_DECK_IDS.caColor,
        name: "Hair Color Theory",
        description: "Formulation, lift, and tone for written exam scenarios.",
        orderIndex: 2,
        cards: CA_COLOR,
      },
      {
        id: SEED_DECK_IDS.caAnatomy,
        name: "Anatomy & Physiology",
        description: "Structure of skin, hair, and nails.",
        orderIndex: 3,
        cards: CA_ANATOMY,
      },
    ],
  },
  {
    id: SEED_GUIDE_IDS.florida,
    name: "Florida Cosmetology Theory",
    programType: "cosmetology",
    state: "FL",
    description:
      "DBPR-focused decks covering Florida rules, sanitation, color theory, and anatomy.",
    estimatedHours: 8,
    orderIndex: 3,
    decks: [
      {
        id: SEED_DECK_IDS.flSanitation,
        name: "Sanitation Basics",
        description: "Florida sanitation statutes and best practices.",
        orderIndex: 1,
        cards: FL_SANITATION,
      },
      {
        id: SEED_DECK_IDS.flColor,
        name: "Hair Color Theory",
        description: "Color wheel, developers, and safety.",
        orderIndex: 2,
        cards: FL_COLOR,
      },
      {
        id: SEED_DECK_IDS.flAnatomy,
        name: "Anatomy & Physiology",
        description: "Hair growth cycles and skin structure.",
        orderIndex: 3,
        cards: FL_ANATOMY,
      },
    ],
  },
];

export const TOTAL_SEED_CARDS = SEED_GUIDES.reduce(
  (sum, g) => sum + g.decks.reduce((d, deck) => d + deck.cards.length, 0),
  0,
);
