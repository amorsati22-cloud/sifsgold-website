export type ToolSlug =
  | "tip-calculator"
  | "color-formula"
  | "dilution-calculator"
  | "appointment-roi"
  | "booth-rent-calculator"
  | "pricing-strategy"
  | "timing-calculator"
  | "inventory-cost"
  | "state-board-countdown"
  | "license-renewal-tracker"
  | "business-tax-estimator"
  | "social-media-scheduler";

export type ToolPreset = {
  id: string;
  user_id: string;
  tool_name: string;
  preset_name: string;
  preset_data: Record<string, unknown>;
  favorite: boolean;
  created_at: string;
};

export type ToolDefinition = {
  slug: ToolSlug;
  name: string;
  description: string;
  icon: string;
  category: "money" | "chemistry" | "business" | "education" | "marketing";
};
