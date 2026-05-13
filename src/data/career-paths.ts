/**
 * Career path marketing stubs.
 * TODO: populate from research backlog — salary ranges and milestones are illustrative.
 */
import type { LucideIcon } from "lucide-react";
import {
  Dumbbell,
  Hand,
  Palette,
  PenTool,
  Scissors,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";

export type CareerRoleSlug =
  | "cosmetologist"
  | "barber"
  | "esthetician"
  | "nail-tech"
  | "tattoo-artist"
  | "massage-therapist"
  | "personal-trainer"
  | "med-spa-provider"
  | "model"
  | "designer";

export type CareerPathStub = {
  slug: CareerRoleSlug;
  title: string;
  shortBlurb: string;
  Icon: LucideIcon;
  salaryRange: string;
  earningsNote: string;
  certifications: string[];
  milestones: { phase: string; title: string; detail: string }[];
};

export const CAREER_PATH_STUBS: CareerPathStub[] = [
  {
    slug: "cosmetologist",
    title: "Cosmetologist",
    shortBlurb: "Cut, color, and finish across a full salon floor or suite.",
    Icon: Scissors,
    salaryRange: "$28k–$75k+ depending on market, chair model, and retail mix (verify).",
    earningsNote: "Retail attachment, extension services, and education nights often move the median up faster than booked hours alone.",
    certifications: ["State cosmetology license", "Manufacturer color certifications", "Extension / texture specialty modules"],
    milestones: [
      { phase: "Student", title: "Clock hours + state board", detail: "School placement, mock boards, and first client models." },
      { phase: "New pro", title: "Associate or commission chair", detail: "Speed, consultation scripts, and rebooking rhythm." },
      { phase: "Lead", title: "Senior / educator track", detail: "Mentoring juniors, advanced tickets, and brand partnerships." },
      { phase: "Leader", title: "Owner or creative director", detail: "P&L, hiring, and multi-location standards." },
    ],
  },
  {
    slug: "barber",
    title: "Barber",
    shortBlurb: "Precision fades, beard architecture, and repeat clientele.",
    Icon: Scissors,
    salaryRange: "$25k–$85k+ with strong walk-in markets and suite ownership (verify).",
    earningsNote: "Membership cuts, straight razor add-ons, and retail pomades compound when booking is predictable.",
    certifications: ["State barber or cosmetology license", "Bloodborne pathogen refreshers", "Straight razor endorsements where required"],
    milestones: [
      { phase: "Student", title: "Barber school + board", detail: "Clipper control, sanitation, and state law exams." },
      { phase: "New pro", title: "Shop floor speed", detail: "Consistent 30–45 minute services without quality drop." },
      { phase: "Lead", title: "Educator / brand artist", detail: "Classes, content, and traveling education." },
      { phase: "Leader", title: "Shop owner or partner", detail: "Chair rental economics and culture." },
    ],
  },
  {
    slug: "esthetician",
    title: "Esthetician",
    shortBlurb: "Skin health, advanced modalities, and calm client journeys.",
    Icon: Sparkles,
    salaryRange: "$26k–$90k+ with med-adjacent services where allowed (verify).",
    earningsNote: "Peels, nano, and device-backed series outperform single facials when bundled responsibly.",
    certifications: ["Esthetics license", "Device manufacturer training", "Chemical peel tiers per insurer / state"],
    milestones: [
      { phase: "Student", title: "Skin science foundations", detail: "Sanitation, Fitzpatrick typing, and consultation ethics." },
      { phase: "New pro", title: "Treatment room mastery", detail: "Series design, photography, and contraindications." },
      { phase: "Lead", title: "Clinical or spa lead", detail: "Protocols, inventory, and trainer duties." },
      { phase: "Leader", title: "Medical spa lane (where licensed)", detail: "Physician collaboration and charting rigor." },
    ],
  },
  {
    slug: "nail-tech",
    title: "Nail Technician",
    shortBlurb: "Structure, art, and speed without sacrificing nail health.",
    Icon: Sparkles,
    salaryRange: "$22k–$65k+ with specialty sets and suite rent models (verify).",
    earningsNote: "Hard gel structure, e-file safety, and nail art tiers differentiate pricing.",
    certifications: ["Manicurist / nail tech license", "E-file certification", "IBX / builder gel manufacturer courses"],
    milestones: [
      { phase: "Student", title: "Core liquid & powder", detail: "Sanitation drills and timing standards." },
      { phase: "New pro", title: "Full book builder", detail: "Repairs, overlays, and art upsells." },
      { phase: "Lead", title: "Salon nail lead", detail: "Chemistry decisions and junior QA." },
      { phase: "Leader", title: "Suite owner or educator", detail: "Retail lines and class revenue." },
    ],
  },
  {
    slug: "tattoo-artist",
    title: "Tattoo Artist",
    shortBlurb: "Custom design, consent, and long healing partnerships.",
    Icon: PenTool,
    salaryRange: "$20k–$120k+ with conventions, merch, and waitlisted specialties (verify).",
    earningsNote: "Day-rate flash drops and large-scale sessions require deposits and clear reschedule rules.",
    certifications: ["Local tattoo licensure / registration", "Bloodborne pathogen training", "First aid / CPR where required"],
    milestones: [
      { phase: "Student", title: "Apprenticeship", detail: "Stencil, saturation, and skin types under supervision." },
      { phase: "New pro", title: "Guest spots", detail: "Portfolio discipline and travel logistics." },
      { phase: "Lead", title: "Private studio", detail: "Waitlist management and aftercare education." },
      { phase: "Leader", title: "Shop owner / mentor", detail: "Multi-artist culture and safety audits." },
    ],
  },
  {
    slug: "massage-therapist",
    title: "Massage Therapist",
    shortBlurb: "Clinical, spa, and recovery modalities with clear scope.",
    Icon: Hand,
    salaryRange: "$24k–$70k+ with medical referral lanes (verify).",
    earningsNote: "Memberships, cupping or lymphatic add-ons, and corporate contracts change weekly revenue curves.",
    certifications: ["State massage license", "NCBTMB (where applicable)", "Specialty CE (sports, prenatal, etc.)"],
    milestones: [
      { phase: "Student", title: "Anatomy + clinic hours", detail: "SOAP notes and draping excellence." },
      { phase: "New pro", title: "Spa or chiro floor", detail: "Pacing six to eight sessions per day sustainably." },
      { phase: "Lead", title: "Lead therapist", detail: "Treatment design and supply QA." },
      { phase: "Leader", title: "Practice owner", detail: "Lease, linens, and continuing education budgets." },
    ],
  },
  {
    slug: "personal-trainer",
    title: "Personal Trainer",
    shortBlurb: "Program design, accountability, and measurable outcomes.",
    Icon: Dumbbell,
    salaryRange: "$22k–$85k+ with semi-private and online stacks (verify).",
    earningsNote: "Hybrid packages (in-person + async check-ins) reduce churn versus single-session selling.",
    certifications: ["NASM / ACE / NSCA (examples)", "CPR / AED", "Nutrition scope per state law"],
    milestones: [
      { phase: "Student", title: "Foundations + internship", detail: "Screening, progressions, and liability basics." },
      { phase: "New pro", title: "Floor hours", detail: "Retention metrics and referral loops." },
      { phase: "Lead", title: "Head coach", detail: "Programming systems for teams." },
      { phase: "Leader", title: "Studio owner", detail: "Equipment finance and coach development paths." },
    ],
  },
  {
    slug: "med-spa-provider",
    title: "Med Spa Provider",
    shortBlurb: "Aesthetic medicine within scope, charting, and collaboration.",
    Icon: Stethoscope,
    salaryRange: "Highly variable by license stack and supervision model (verify).",
    earningsNote: "Bundle consultations, device series, and retail home-care to align outcomes with revenue ethics.",
    certifications: ["RN / NP / PA per role", "Laser / energy device training", "HIPAA-minded documentation"],
    milestones: [
      { phase: "Student", title: "Core clinical training", detail: "Assessment, consent, and delegation rules." },
      { phase: "New pro", title: "Aesthetic floor", detail: "Photography standards and complication pathways." },
      { phase: "Lead", title: "Clinical director track", detail: "Protocols, audits, and vendor selection." },
      { phase: "Leader", title: "Partner / owner", detail: "Medical director relationships and compliance calendars." },
    ],
  },
  {
    slug: "model",
    title: "Model",
    shortBlurb: "Editorial, commercial, runway, and fit — with professional boundaries.",
    Icon: User,
    salaryRange: "$0–$150k+ with agency representation and usage buyouts (verify).",
    earningsNote: "Day rates plus usage, travel, and overtime should be explicit in every booking letter.",
    certifications: ["Agency development programs", "Runway / movement intensives", "Financial literacy for 1099 income"],
    milestones: [
      { phase: "Student", title: "Digitals + comp cards", detail: "Polaroid honesty and digitals that match real life." },
      { phase: "New pro", title: "Test shoots", detail: "Set etiquette, boundaries, and release forms." },
      { phase: "Lead", title: "Signed talent", detail: "Mother agency relationships and overseas rules." },
      { phase: "Leader", title: "Face of campaigns", detail: "Exclusivity windows and charity alignment." },
    ],
  },
  {
    slug: "designer",
    title: "Designer",
    shortBlurb: "Silhouette, textile, and brand systems for runway and retail.",
    Icon: Palette,
    salaryRange: "$35k–$130k+ depending on house size and freelance mix (verify).",
    earningsNote: "Licensing, capsule royalties, and teaching adjuncts diversify volatile runway seasons.",
    certifications: ["Fashion design degree (optional)", "CAD / CLO3D proficiency", "Sustainability certs where marketed"],
    milestones: [
      { phase: "Student", title: "Portfolio + internships", detail: "Draping, flats, and line sheets." },
      { phase: "New pro", title: "Assistant designer", detail: "Vendor communication and spec packs." },
      { phase: "Lead", title: "Category lead", detail: "Margin targets and calendar ownership." },
      { phase: "Leader", title: "Creative director", detail: "Runway narrative and wholesale strategy." },
    ],
  },
];

export const CAREER_PATH_BY_SLUG = Object.fromEntries(CAREER_PATH_STUBS.map((c) => [c.slug, c])) as Record<
  CareerRoleSlug,
  CareerPathStub
>;

export function getCareerPath(slug: string): CareerPathStub | undefined {
  return CAREER_PATH_BY_SLUG[slug as CareerRoleSlug];
}
