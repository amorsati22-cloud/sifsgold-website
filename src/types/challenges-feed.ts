export type ChallengeType = "self_care" | "skill_building" | "creative" | "community";

export type AdvocatePostType = "tip" | "tutorial" | "before_after" | "brand_partner";

export type AdvocatePostStatus = "pending_review" | "published" | "rejected";

export type BeautyChallenge = {
  id: string;
  name: string;
  description: string;
  challenge_type: ChallengeType;
  duration_days: number;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  prize: string | null;
  sponsor_brand_id: string | null;
  ftc_disclosure_required: boolean;
  active: boolean;
  participant_count: number;
  daily_prompts: { day: number; title: string; prompt: string }[];
};

export type ChallengeParticipant = {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  days_completed: number;
  completed_at: string | null;
  public: boolean;
};

export type ChallengeCheckIn = {
  id: string;
  challenge_id: string;
  user_id: string;
  day_number: number;
  check_in_date: string;
  photo_url: string | null;
  caption: string | null;
  created_at: string;
  approved: boolean;
};

export type AdvocatePost = {
  id: string;
  advocate_id: string;
  post_type: AdvocatePostType;
  title: string;
  body: string;
  image_urls: string[];
  video_url: string | null;
  linked_brand_deal_id: string | null;
  ftc_disclosure_text: string | null;
  status: AdvocatePostStatus;
  published_at: string | null;
  view_count: number;
  like_count: number;
  created_at: string;
};

export type AdvocatePostPublic = AdvocatePost & {
  advocate: {
    id: string;
    display_name: string;
    username: string | null;
    avatar_url: string | null;
    specialty_tags: string[];
  };
};

export type PostEngagementAction = "view" | "like" | "save" | "share";
