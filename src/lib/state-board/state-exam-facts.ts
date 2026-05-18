import type { ProgramType } from "@/types/state-board";
import type { PublishedStateCode } from "@/lib/state-board/constants";

/** Verified-style state board facts — each question bank is scoped to one record. */
export type StateExamFacts = {
  stateCode: PublishedStateCode;
  stateName: string;
  slug: string;
  programType: ProgramType;
  examName: string;
  boardName: string;
  vendor: string;
  requiredHours: number;
  passingScore: number;
  timeLimitMinutes: number;
  statuteCitation: string;
  officialLink: string;
  lastUpdated: string;
};

export const STATE_EXAM_FACTS: Record<PublishedStateCode, StateExamFacts> = {
  TX: {
    stateCode: "TX",
    stateName: "Texas",
    slug: "tx",
    programType: "cosmetology",
    examName: "Texas Cosmetology Operator Theory",
    boardName: "Texas Department of Licensing and Regulation (TDLR)",
    vendor: "NIC (National-Interstate Council)",
    requiredHours: 1000,
    passingScore: 75,
    timeLimitMinutes: 120,
    statuteCitation: "Texas Occupations Code, Chapter 1602",
    officialLink: "https://www.tdlr.texas.gov/cosmet/cosmet.htm",
    lastUpdated: "2026-05-01",
  },
  CA: {
    stateCode: "CA",
    stateName: "California",
    slug: "ca",
    programType: "cosmetology",
    examName: "California Cosmetologist Written Examination",
    boardName: "Board of Barbering and Cosmetology (BBC)",
    vendor: "Pearson VUE / National Testing Network",
    requiredHours: 1600,
    passingScore: 75,
    timeLimitMinutes: 120,
    statuteCitation: "California Business and Professions Code, Division 3, Chapter 10",
    officialLink: "https://www.barberingcosmetology.ca.gov/",
    lastUpdated: "2026-05-01",
  },
  FL: {
    stateCode: "FL",
    stateName: "Florida",
    slug: "fl",
    programType: "cosmetology",
    examName: "Florida Cosmetology License Examination",
    boardName:
      "Florida Department of Business and Professional Regulation (DBPR), Board of Cosmetology",
    vendor: "Pearson VUE / NIC (per candidate handbook)",
    requiredHours: 1200,
    passingScore: 75,
    timeLimitMinutes: 120,
    statuteCitation: "Florida Statutes Chapter 477, Part II",
    officialLink: "https://www.myfloridalicense.com/DBPR/cosmetology/",
    lastUpdated: "2026-05-01",
  },
  NY: {
    stateCode: "NY",
    stateName: "New York",
    slug: "ny",
    programType: "cosmetology",
    examName: "New York Cosmetology Written Examination",
    boardName: "NY Department of State, Division of Licensing Services",
    vendor: "Pearson VUE / PSI (per DOS scheduling)",
    requiredHours: 1000,
    passingScore: 70,
    timeLimitMinutes: 150,
    statuteCitation: "NY General Business Law Article 27 (Appearance Enhancement)",
    officialLink: "https://dos.ny.gov/appearance-enhancement",
    lastUpdated: "2026-05-01",
  },
  PA: {
    stateCode: "PA",
    stateName: "Pennsylvania",
    slug: "pa",
    programType: "cosmetology",
    examName: "Pennsylvania Cosmetologist Theory Examination",
    boardName: "State Board of Cosmetology (PA Department of State)",
    vendor: "Pearson VUE",
    requiredHours: 1250,
    passingScore: 75,
    timeLimitMinutes: 120,
    statuteCitation: "63 P.S. §§ 531–551 (Cosmetology Law)",
    officialLink:
      "https://www.pa.gov/agencies/dos/programs-and-services/professional-licensing/cosmetology.html",
    lastUpdated: "2026-05-01",
  },
};

/** Distractor hours from other published states (never generic “1,500 typical”). */
export function otherStateHourDistractors(
  facts: StateExamFacts,
  count = 3,
): number[] {
  const pool = Object.values(STATE_EXAM_FACTS)
    .map((f) => f.requiredHours)
    .filter((h) => h !== facts.requiredHours);
  return pool.slice(0, count);
}

export function getFactsBySlug(slug: string): StateExamFacts | undefined {
  const code = slug.toUpperCase() as PublishedStateCode;
  return STATE_EXAM_FACTS[code];
}
