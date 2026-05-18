import type { BeautyChallenge } from "@/types/challenges-feed";

function cid(n: number): string {
  return `c${String(n).padStart(7, "0")}-0003-4003-8003-${String(n).padStart(12, "0")}`;
}

function prompts(days: { title: string; prompt: string }[]) {
  return days.map((d, i) => ({ day: i + 1, ...d }));
}

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const SEED_CHALLENGES: BeautyChallenge[] = [
  {
    id: cid(1),
    name: "7 Days of Self-Care",
    description:
      "Body-positive rituals for rest, hydration, and joy — no transformation goals, no before/after pressure.",
    challenge_type: "self_care",
    duration_days: 7,
    start_date: fmt(today),
    end_date: fmt(addDays(today, 6)),
    cover_image_url: null,
    prize: "Featured on Sif's Gold community spotlight",
    sponsor_brand_id: null,
    ftc_disclosure_required: false,
    active: true,
    participant_count: 128,
    daily_prompts: prompts([
      { title: "Pause", prompt: "Take five minutes away from screens — breathe, stretch, or sip water." },
      { title: "Hydrate", prompt: "Drink an extra glass of water and notice how your body feels." },
      { title: "Gentle touch", prompt: "Apply hand cream or oil slowly — a small act of care for you." },
      { title: "Boundary", prompt: "Say no to one thing that drains you today." },
      { title: "Joy", prompt: "Do something that makes you smile with zero productivity goal." },
      { title: "Rest", prompt: "Protect your sleep window tonight — dim lights, calm routine." },
      { title: "Gratitude", prompt: "Name three things your body did for you this week." },
    ]),
  },
  {
    id: cid(2),
    name: "Color Theory Mastery",
    description: "Build formulation confidence with daily study — skill-focused, not appearance-focused.",
    challenge_type: "skill_building",
    duration_days: 14,
    start_date: fmt(today),
    end_date: fmt(addDays(today, 13)),
    cover_image_url: null,
    prize: "Study guide bundle shout-out",
    sponsor_brand_id: null,
    ftc_disclosure_required: false,
    active: true,
    participant_count: 84,
    daily_prompts: prompts([
      { title: "Level", prompt: "Review level vs tone on a swatch chart for 10 minutes." },
      { title: "Underlying pigment", prompt: "Sketch warm vs cool underlying pigment notes." },
      { title: "Consult", prompt: "Practice explaining one color choice in client-friendly language." },
      { title: "Strand test", prompt: "Plan a strand test — document timing, not results photos." },
      { title: "Grey blend", prompt: "Study one grey-blending approach from manufacturer education." },
      { title: "Correction map", prompt: "Map a color correction flowchart on paper." },
      { title: "Rest day", prompt: "Rest your eyes — revisit notes tomorrow." },
    ]).concat(
      prompts([
        { title: "Formulation", prompt: "Write a formula for a demi refresh without photos." },
        { title: "Share", prompt: "Teach a peer one concept you learned this week." },
        { title: "Celebrate craft", prompt: "Celebrate a technique win — not a physical change." },
      ]).map((p, i) => ({ ...p, day: 8 + i })),
    ),
  },
  {
    id: cid(3),
    name: "Creative Chair Moments",
    description: "Document craft, tools, and process — celebrate artistry without comparison framing.",
    challenge_type: "creative",
    duration_days: 10,
    start_date: fmt(addDays(today, -3)),
    end_date: fmt(addDays(today, 6)),
    cover_image_url: null,
    prize: null,
    sponsor_brand_id: null,
    ftc_disclosure_required: false,
    active: true,
    participant_count: 56,
    daily_prompts: prompts([
      { title: "Tools flat lay", prompt: "Photograph your tools setup — no faces required." },
      { title: "Texture", prompt: "Close-up of texture you created (with consent)." },
      { title: "Palette", prompt: "Share a color palette that inspires today's work." },
      { title: "Process", prompt: "Mid-process shot — show the work, not a reveal." },
      { title: "Education", prompt: "Share one tip you wish you knew as a student." },
    ]),
  },
  {
    id: cid(4),
    name: "Community Kindness Chain",
    description: "Uplift another pro or client — kindness only, no critique of bodies.",
    challenge_type: "community",
    duration_days: 5,
    start_date: fmt(today),
    end_date: fmt(addDays(today, 4)),
    cover_image_url: null,
    prize: null,
    sponsor_brand_id: null,
    ftc_disclosure_required: false,
    active: true,
    participant_count: 201,
    daily_prompts: prompts([
      { title: "Shout-out", prompt: "Tag a colleague whose work you respect." },
      { title: "Review", prompt: "Leave a thoughtful review for a pro you booked." },
      { title: "Mentor", prompt: "Send encouragement to a student in your network." },
      { title: "Client care", prompt: "Share how you make clients feel safe in your chair." },
      { title: "Pay it forward", prompt: "Offer a small kindness with no expectation back." },
    ]),
  },
  {
    id: cid(5),
    name: "Mindful Hands Week",
    description: "Ergonomics and hand care for long days — wellness for pros.",
    challenge_type: "self_care",
    duration_days: 7,
    start_date: fmt(addDays(today, -14)),
    end_date: fmt(addDays(today, -8)),
    cover_image_url: null,
    prize: null,
    sponsor_brand_id: null,
    ftc_disclosure_required: false,
    active: false,
    participant_count: 312,
    daily_prompts: prompts([
      { title: "Stretch", prompt: "Two-minute wrist and forearm stretch between clients." },
      { title: "Posture", prompt: "Reset chair height and posture checklist." },
    ]),
  },
];
