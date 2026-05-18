import { ROLE_IDS } from "@/lib/career-paths/constants";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; label: string; scores: Record<string, number> }[];
};

/** Maps quiz dimension → role IDs */
const DIM = {
  creative: ROLE_IDS.colorSpecialist,
  business: ROLE_IDS.salonManager,
  teaching: ROLE_IDS.educator,
  craft: ROLE_IDS.cosmetologist,
  skin: ROLE_IDS.esthetician,
  nails: ROLE_IDS.nailTech,
  barber: ROLE_IDS.barber,
  massage: ROLE_IDS.massageTherapist,
  tattoo: ROLE_IDS.tattooArtist,
  events: ROLE_IDS.weddingStylist,
  celebrity: ROLE_IDS.celebrityStylist,
};

export const CAREER_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What energizes you most?",
    options: [
      { id: "a", label: "Creative transformation (color, cut, style)", scores: { creative: 3, craft: 2 } },
      { id: "b", label: "Business systems and team leadership", scores: { business: 3 } },
      { id: "c", label: "Teaching and breaking down technique", scores: { teaching: 3 } },
      { id: "d", label: "Hands-on craft and repeat clientele", scores: { craft: 3, barber: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: "Which work environment fits you best?",
    options: [
      { id: "a", label: "Fast-paced salon floor", scores: { craft: 2, creative: 1 } },
      { id: "b", label: "Calm treatment room", scores: { skin: 3, massage: 1 } },
      { id: "c", label: "Barbershop culture", scores: { barber: 3 } },
      { id: "d", label: "Travel / stage / events", scores: { events: 2, celebrity: 2, teaching: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "How do you feel about science and skin anatomy?",
    options: [
      { id: "a", label: "Love it — I want device and peel knowledge", scores: { skin: 3 } },
      { id: "b", label: "Prefer hair chemistry and formulation", scores: { creative: 3 } },
      { id: "c", label: "Prefer structure and hand skills on nails", scores: { nails: 3 } },
      { id: "d", label: "Prefer muscle anatomy and pressure", scores: { massage: 3 } },
    ],
  },
  {
    id: "q4",
    prompt: "Income stability vs. upside — what matters more right now?",
    options: [
      { id: "a", label: "Steady W-2 or commission floor", scores: { craft: 2, skin: 1 } },
      { id: "b", label: "Owning my own book / suite", scores: { business: 2, craft: 1 } },
      { id: "c", label: "Brand deals and content", scores: { teaching: 2, celebrity: 1 } },
      { id: "d", label: "Building a shop or multi-chair business", scores: { business: 3 } },
    ],
  },
  {
    id: "q5",
    prompt: "Which tool sounds most appealing to master?",
    options: [
      { id: "a", label: "Shears and razors", scores: { craft: 2, barber: 2 } },
      { id: "b", label: "Lash isolation tweezers", scores: { skin: 1, nails: 1 } },
      { id: "c", label: "Tattoo machine", scores: { tattoo: 3 } },
      { id: "d", label: "Color bowl and balayage brushes", scores: { creative: 3 } },
    ],
  },
  {
    id: "q6",
    prompt: "How do you handle client consultation?",
    options: [
      { id: "a", label: "Quick, confident, high volume", scores: { barber: 2, craft: 1 } },
      { id: "b", label: "Long, educational, series-based", scores: { skin: 2, massage: 1 } },
      { id: "c", label: "Creative mood boards and photos", scores: { creative: 2, events: 1 } },
      { id: "d", label: "Coaching toward lifestyle goals", scores: { massage: 2, teaching: 1 } },
    ],
  },
  {
    id: "q7",
    prompt: "Continuing education — your preference?",
    options: [
      { id: "a", label: "Manufacturer academies and stage classes", scores: { creative: 2, teaching: 1 } },
      { id: "b", label: "Business and management workshops", scores: { business: 3 } },
      { id: "c", label: "Clinical device certifications", scores: { skin: 3 } },
      { id: "d", label: "Competition nail art", scores: { nails: 3 } },
    ],
  },
  {
    id: "q8",
    prompt: "Where do you see yourself in 10 years?",
    options: [
      { id: "a", label: "Owning multiple locations", scores: { business: 3 } },
      { id: "b", label: "Session / celebrity work", scores: { celebrity: 3, events: 1 } },
      { id: "c", label: "School owner or lead educator", scores: { teaching: 3 } },
      { id: "d", label: "Specialist with a waitlist", scores: { creative: 2, tattoo: 1, nails: 1 } },
    ],
  },
  {
    id: "q9",
    prompt: "Physical demands you prefer?",
    options: [
      { id: "a", label: "Standing at a chair all day", scores: { craft: 2, barber: 2 } },
      { id: "b", label: "Detailed close work (lashes, nails)", scores: { nails: 2, skin: 1 } },
      { id: "c", label: "Full-body massage", scores: { massage: 3 } },
      { id: "d", label: "Mixed travel and on-set", scores: { events: 2, celebrity: 2 } },
    ],
  },
  {
    id: "q10",
    prompt: "Risk tolerance for entrepreneurship?",
    options: [
      { id: "a", label: "Low — build skills first", scores: { craft: 2, skin: 1 } },
      { id: "b", label: "Medium — suite or mobile", scores: { business: 1, craft: 1 } },
      { id: "c", label: "High — shop or brand from early on", scores: { business: 3 } },
      { id: "d", label: "High — content-first career", scores: { teaching: 2, celebrity: 1 } },
    ],
  },
];

const DIM_TO_ROLE: Record<string, string> = {
  creative: DIM.creative,
  business: DIM.business,
  teaching: DIM.teaching,
  craft: DIM.craft,
  skin: DIM.skin,
  nails: DIM.nails,
  barber: DIM.barber,
  massage: DIM.massage,
  tattoo: DIM.tattoo,
  events: DIM.events,
  celebrity: DIM.celebrity,
};

export function scoreQuiz(answers: Record<string, string>): string[] {
  const totals: Record<string, number> = {};
  for (const q of CAREER_QUIZ) {
    const choice = answers[q.id];
    const opt = q.options.find((o) => o.id === choice);
    if (!opt) continue;
    for (const [dim, pts] of Object.entries(opt.scores)) {
      totals[dim] = (totals[dim] ?? 0) + pts;
    }
  }
  const roleScores = new Map<string, number>();
  for (const [dim, pts] of Object.entries(totals)) {
    const roleId = DIM_TO_ROLE[dim];
    if (roleId) roleScores.set(roleId, (roleScores.get(roleId) ?? 0) + pts);
  }
  return [...roleScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);
}
