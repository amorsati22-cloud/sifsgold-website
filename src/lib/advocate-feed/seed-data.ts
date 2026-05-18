import type { AdvocatePost } from "@/types/challenges-feed";

function pid(n: number): string {
  return `p${String(n).padStart(7, "0")}-0004-4004-8004-${String(n).padStart(12, "0")}`;
}

/** advocate_id must match real advocate_profiles.id in DB when seeded; use placeholder for fallback display */
export const SEED_ADVOCATE_ID = "00000000-0000-4000-8000-000000000099";

export const SEED_ADVOCATE_POSTS: AdvocatePost[] = [
  {
    id: pid(1),
    advocate_id: SEED_ADVOCATE_ID,
    post_type: "tip",
    title: "Consultation questions that build trust",
    body: "Ask what maintenance window feels realistic — not what they wish they looked like. Clients open up when goals are collaborative.",
    image_urls: [],
    video_url: null,
    linked_brand_deal_id: null,
    ftc_disclosure_text: null,
    status: "published",
    published_at: new Date().toISOString(),
    view_count: 420,
    like_count: 38,
    created_at: new Date().toISOString(),
  },
  {
    id: pid(2),
    advocate_id: SEED_ADVOCATE_ID,
    post_type: "tutorial",
    title: "Gloss refresh without over-processing",
    body: "A demi refresh can revive tone between full services — always strand test and document timing.",
    image_urls: [],
    video_url: null,
    linked_brand_deal_id: null,
    ftc_disclosure_text: null,
    status: "published",
    published_at: new Date().toISOString(),
    view_count: 310,
    like_count: 27,
    created_at: new Date().toISOString(),
  },
  {
    id: pid(3),
    advocate_id: SEED_ADVOCATE_ID,
    post_type: "brand_partner",
    title: "Why I reach for this bond builder between services",
    body: "Honest routine on damaged hair — focused on integrity, not transformation promises.",
    image_urls: [],
    video_url: null,
    linked_brand_deal_id: null,
    ftc_disclosure_text:
      "Paid partnership with Partner Brand. #ad #partner Posted on Sif's Gold. This disclosure is provided in accordance with the U.S. FTC Endorsement Guides (16 CFR Part 255).",
    status: "published",
    published_at: new Date().toISOString(),
    view_count: 890,
    like_count: 64,
    created_at: new Date().toISOString(),
  },
];
