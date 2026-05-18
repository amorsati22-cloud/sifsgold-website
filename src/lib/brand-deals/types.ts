export type CampaignStatus = "draft" | "published" | "paused" | "closed" | "completed";
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";
export type ContractStatus = "pending_signatures" | "active" | "completed" | "terminated" | "disputed";
export type DeliverableStatus = "pending" | "submitted" | "under_review" | "approved" | "rejected" | "paid_out";

export type CampaignDeliverableSpec = {
  type: string;
  count: number;
  requirements: string;
};

export type BrandCampaign = {
  id: string;
  brand_partner_id: string;
  title: string;
  description: string;
  objective: string;
  campaign_type: string;
  total_budget: number;
  max_advocates: number;
  per_advocate_compensation: number;
  compensation_type: string;
  product_value: number | null;
  commission_percent: number | null;
  deliverables: CampaignDeliverableSpec[];
  platforms_required: string[];
  application_deadline: string;
  delivery_deadline: string;
  payment_terms: string;
  target_advocate_specialties: string[];
  target_advocate_min_followers: number | null;
  target_advocate_locations: string[];
  ftc_disclosure_template: string | null;
  exclusivity_clause: string;
  usage_rights: string;
  status: CampaignStatus;
  escrow_funded: boolean;
  escrow_amount: number | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  published_at: string | null;
};

export type CampaignApplication = {
  id: string;
  campaign_id: string;
  advocate_id: string;
  pitch: string;
  portfolio_samples: { url: string; caption?: string }[];
  proposed_timeline: string | null;
  status: ApplicationStatus;
  applied_at: string;
  contract_id: string | null;
};

export type CampaignContract = {
  id: string;
  campaign_id: string;
  advocate_id: string;
  application_id: string | null;
  contract_terms: Record<string, unknown>;
  compensation_amount: number;
  compensation_type: string;
  signed_by_brand: boolean;
  signed_by_advocate: boolean;
  brand_signed_at: string | null;
  advocate_signed_at: string | null;
  contract_pdf_url: string | null;
  status: ContractStatus;
};

export type CampaignDeliverable = {
  id: string;
  contract_id: string;
  deliverable_type: string;
  description: string | null;
  due_date: string | null;
  submitted_url: string | null;
  ftc_disclosure_text: string | null;
  ftc_compliance_verified: boolean;
  brand_approved: boolean;
  status: DeliverableStatus;
};
