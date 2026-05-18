import type { AffirmationCategory, AffirmationSeason, DailyAffirmation } from "@/types/affirmations";

function aid(n: number): string {
  return `a${String(n).padStart(7, "0")}-0001-4001-8001-${String(n).padStart(12, "0")}`;
}

type SeedRow = {
  text: string;
  category: AffirmationCategory;
  target_audience: ("pros" | "clients" | "students")[];
  season?: AffirmationSeason;
};

const ROWS: SeedRow[] = [
  // self_worth (20)
  { text: "You are allowed to take up space in this industry.", category: "self_worth", target_audience: ["pros", "clients", "students"] },
  { text: "Your presence in the chair is a gift — to clients and to yourself.", category: "self_worth", target_audience: ["pros", "students"] },
  { text: "You do not need to earn rest to deserve it.", category: "self_worth", target_audience: ["pros", "clients"] },
  { text: "Being new does not mean being less. Every expert was once a beginner.", category: "self_worth", target_audience: ["students"] },
  { text: "Your worth is not measured by how booked you are this week.", category: "self_worth", target_audience: ["pros"] },
  { text: "You can be proud of small progress. Small still counts.", category: "self_worth", target_audience: ["students", "clients"] },
  { text: "The mirror reflects a person who chose to show up today.", category: "self_worth", target_audience: ["clients"] },
  { text: "You are more than your last appointment.", category: "self_worth", target_audience: ["pros"] },
  { text: "Gentleness toward yourself makes you steadier for others.", category: "self_worth", target_audience: ["pros", "clients"] },
  { text: "Your voice in consultation matters as much as your technique.", category: "self_worth", target_audience: ["pros", "students"] },
  { text: "You belong in rooms where beauty is built with care.", category: "self_worth", target_audience: ["pros", "students"] },
  { text: "Choosing self-respect is never wasted time.", category: "self_worth", target_audience: ["clients", "pros"] },
  { text: "You are learning in public — that takes courage.", category: "self_worth", target_audience: ["students"] },
  { text: "Your body carries your story with dignity.", category: "self_worth", target_audience: ["clients"] },
  { text: "You can set boundaries and still be deeply caring.", category: "self_worth", target_audience: ["pros"] },
  { text: "Today you are enough for the step in front of you.", category: "self_worth", target_audience: ["pros", "clients", "students"] },
  { text: "Confidence grows when you honor your own pace.", category: "self_worth", target_audience: ["students", "pros"] },
  { text: "You deserve the same patience you offer in the chair.", category: "self_worth", target_audience: ["pros"] },
  { text: "Your uniqueness is part of your craft, not a flaw.", category: "self_worth", target_audience: ["pros", "students"] },
  { text: "Every appointment is an act of care. Yours included.", category: "self_worth", target_audience: ["pros", "clients"] },

  // craft_pride (20)
  { text: "Your hands carry years of practice. They are trusted.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Precision is built rep by rep — you are building something real.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "The details you notice are what clients remember.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Your chair is a studio. Your tools are instruments.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Continuing education is proof you respect the craft.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "A steady hand comes from a steady mind.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "You turn intention into texture, shape, and color.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Mastery is a direction, not a finish line.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "Your portfolio is a timeline of growth — honor it.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "Sanitation and setup are acts of professional love.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "You read hair, skin, and nails like a language.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Each consultation sharpens your eye.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "You protect the integrity of the hair and the person wearing it.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Technique plus empathy is your signature.", category: "craft_pride", target_audience: ["pros"] },
  { text: "The work you do today trains the pro you become tomorrow.", category: "craft_pride", target_audience: ["students"] },
  { text: "You are allowed to be proud without being perfect.", category: "craft_pride", target_audience: ["pros", "students"] },
  { text: "Your timing at the bowl matters as much as the formula.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Craft is repetition with curiosity.", category: "craft_pride", target_audience: ["students", "pros"] },
  { text: "You elevate industry standards one appointment at a time.", category: "craft_pride", target_audience: ["pros"] },
  { text: "Trust the hours you have already invested.", category: "craft_pride", target_audience: ["pros", "students"] },

  // client_care (20)
  { text: "The way you make people feel matters more than the technique.", category: "client_care", target_audience: ["pros", "students"] },
  { text: "Listening is a service. You offer it generously.", category: "client_care", target_audience: ["pros"] },
  { text: "Clear expectations are a form of kindness.", category: "client_care", target_audience: ["pros", "students"] },
  { text: "You create safety before you create transformation.", category: "client_care", target_audience: ["pros"] },
  { text: "A calm chair changes the whole appointment.", category: "client_care", target_audience: ["pros", "clients"] },
  { text: "You honor each person's history with their hair and skin.", category: "client_care", target_audience: ["pros"] },
  { text: "Consent and comfort are never optional extras.", category: "client_care", target_audience: ["pros", "students"] },
  { text: "You explain without condescending — that is rare care.", category: "client_care", target_audience: ["pros"] },
  { text: "Clients remember how you held space for their nerves.", category: "client_care", target_audience: ["pros", "students"] },
  { text: "You celebrate wins that only they can see.", category: "client_care", target_audience: ["pros"] },
  { text: "Aftercare guidance is care that continues at home.", category: "client_care", target_audience: ["pros", "students"] },
  { text: "You meet people where they are, not where you wish they were.", category: "client_care", target_audience: ["pros", "clients"] },
  { text: "Your chair can be the gentlest part of someone's week.", category: "client_care", target_audience: ["pros", "clients"] },
  { text: "You protect dignity in every draping, every word.", category: "client_care", target_audience: ["pros", "students"] },
  { text: "Being seen without judgment is healing work.", category: "client_care", target_audience: ["clients"] },
  { text: "You deserve a provider who explains, not pressures.", category: "client_care", target_audience: ["clients"] },
  { text: "Your comfort during a service is non-negotiable.", category: "client_care", target_audience: ["clients"] },
  { text: "Questions are welcome. You are allowed to ask them.", category: "client_care", target_audience: ["clients", "students"] },
  { text: "Care looks like patience, not hurry.", category: "client_care", target_audience: ["pros", "clients"] },
  { text: "You hold standards that keep people safe and seen.", category: "client_care", target_audience: ["pros"] },

  // rest_recovery (20)
  { text: "Rest is part of the work. You are not your output.", category: "rest_recovery", target_audience: ["pros"] },
  { text: "A day off refuels your hands and your heart.", category: "rest_recovery", target_audience: ["pros"] },
  { text: "Hydration and meals are professional tools too.", category: "rest_recovery", target_audience: ["pros", "students"] },
  { text: "Your body asks for breaks — answering is wisdom.", category: "rest_recovery", target_audience: ["pros"] },
  { text: "Closing the books can wait. Closing your eyes cannot.", category: "rest_recovery", target_audience: ["pros"] },
  { text: "Saying no to one booking can mean yes to your longevity.", category: "rest_recovery", target_audience: ["pros"] },
  { text: "Stretching between clients is maintenance for your career.", category: "rest_recovery", target_audience: ["pros", "students"] },
  { text: "You are not lazy for needing recovery after standing all day.", category: "rest_recovery", target_audience: ["pros"] },
  { text: "Quiet mornings are allowed in a loud industry.", category: "rest_recovery", target_audience: ["pros", "clients"] },
  { text: "Sleep is part of showing up with steady hands.", category: "rest_recovery", target_audience: ["pros", "students"] },
  { text: "Recovery today prevents burnout tomorrow.", category: "rest_recovery", target_audience: ["pros", "students"] },
  { text: "You can log off without guilt.", category: "rest_recovery", target_audience: ["pros", "clients"] },
  { text: "Stillness is not falling behind.", category: "rest_recovery", target_audience: ["pros", "clients", "students"] },
  { text: "Your nervous system deserves the same care you give skin.", category: "rest_recovery", target_audience: ["pros", "clients"] },
  { text: "Taking a slow evening is productive for your wellbeing.", category: "rest_recovery", target_audience: ["clients", "pros"] },
  { text: "Exam season needs sleep as much as flashcards.", category: "rest_recovery", target_audience: ["students"] },
  { text: "You can pause without losing momentum.", category: "rest_recovery", target_audience: ["students", "pros"] },
  { text: "Winter asks for softer pacing. Listen.", category: "rest_recovery", target_audience: ["pros", "clients"], season: "winter" },
  { text: "Summer heat asks for shade and water. Grant yourself both.", category: "rest_recovery", target_audience: ["pros"], season: "summer" },
  { text: "A full calendar is not the only measure of success.", category: "rest_recovery", target_audience: ["pros", "students"] },

  // abundance (20)
  { text: "You did not come this far to come only this far.", category: "abundance", target_audience: ["pros", "students"] },
  { text: "Sustainable income honors your skill and your time.", category: "abundance", target_audience: ["pros"] },
  { text: "You can charge fairly and still be deeply generous.", category: "abundance", target_audience: ["pros", "students"] },
  { text: "Referrals are trust returning to you.", category: "abundance", target_audience: ["pros"] },
  { text: "There is room for your success beside others doing well.", category: "abundance", target_audience: ["pros", "students"] },
  { text: "Your pipeline can grow without hustling past your limits.", category: "abundance", target_audience: ["pros"] },
  { text: "Financial clarity is self-respect in spreadsheet form.", category: "abundance", target_audience: ["pros"] },
  { text: "You are building a career, not just filling a schedule.", category: "abundance", target_audience: ["pros", "students"] },
  { text: "Investing in tools is investing in future you.", category: "abundance", target_audience: ["pros", "students"] },
  { text: "Gratitude and ambition can share the same heart.", category: "abundance", target_audience: ["pros", "clients"] },
  { text: "Spring is a season for planting new offerings.", category: "abundance", target_audience: ["pros"], season: "spring" },
  { text: "Fall is for refining what already works.", category: "abundance", target_audience: ["pros"], season: "fall" },
  { text: "Clients who value you will find you.", category: "abundance", target_audience: ["pros", "students"] },
  { text: "You can celebrate income without apologizing for it.", category: "abundance", target_audience: ["pros"] },
  { text: "Abundance includes time, health, and joy — not only revenue.", category: "abundance", target_audience: ["pros", "clients"] },
  { text: "Your first paid service was proof the market makes space.", category: "abundance", target_audience: ["students"] },
  { text: "Learning now compounds into earning later.", category: "abundance", target_audience: ["students"] },
  { text: "You are worthy of support while you grow.", category: "abundance", target_audience: ["students", "clients"] },
  { text: "Small wins stack into a stable practice.", category: "abundance", target_audience: ["pros", "students"] },
  { text: "Prosperity can be quiet and still be real.", category: "abundance", target_audience: ["pros", "clients"] },
];

export const SEED_AFFIRMATIONS: DailyAffirmation[] = ROWS.map((r, i) => ({
  id: aid(i + 1),
  text: r.text,
  category: r.category,
  target_audience: r.target_audience,
  season: r.season ?? null,
  active: true,
}));
