export type MoodLabel = "great" | "good" | "okay" | "low" | "rough";

export type FlowIntensity = "spotting" | "light" | "medium" | "heavy" | "none";

export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

export type MedicationFrequency = "daily" | "twice_daily" | "as_needed" | "weekly";

export type MedicationPurpose =
  | "allergies"
  | "birth_control"
  | "mental_health"
  | "pain"
  | "other";

export type BeverageType = "water" | "tea" | "coffee" | "electrolytes" | "other";

export type RitualStep =
  | "breathwork"
  | "stretch_wrists"
  | "stretch_back"
  | "mindset_check"
  | "hydration"
  | "intentions";

export type PhysicalFeeling =
  | "rested"
  | "sore"
  | "achy"
  | "tense"
  | "energized";

export type CycleSymptom =
  | "cramps"
  | "headache"
  | "bloating"
  | "breast_tenderness"
  | "mood_swings";

export interface HealthHubSettings {
  id: string;
  enabled: boolean;
  daily_pulse_enabled: boolean;
  cycle_sync_enabled: boolean;
  medication_tracker_enabled: boolean;
  hydration_tracker_enabled: boolean;
  preshift_ritual_enabled: boolean;
  hydration_goal_oz: number;
  reauthenticate_after_minutes: 1 | 5 | 15 | 60;
  data_retention_days: number;
  export_format: "csv" | "json";
  created_at: string;
  updated_at: string;
}

export interface DailyPulseLog {
  id: string;
  user_id: string;
  logged_at: string;
  energy_level: number;
  mood_label: MoodLabel;
  sleep_hours: number | null;
  sleep_quality: number | null;
  stress_level: number | null;
  physical_feeling: PhysicalFeeling[];
  notes: string | null;
  created_at: string;
}

export interface CycleLog {
  id: string;
  user_id: string;
  log_date: string;
  flow_intensity: FlowIntensity | null;
  symptoms: CycleSymptom[];
  cycle_day: number | null;
  phase: CyclePhase | null;
  notes: string | null;
  created_at: string;
}

export interface MedicationEntry {
  id: string;
  user_id: string;
  medication_name: string;
  dosage: string | null;
  frequency: MedicationFrequency | null;
  start_date: string | null;
  end_date: string | null;
  prescribed_by: string | null;
  purpose_category: MedicationPurpose | null;
  reminders_enabled: boolean;
  reminder_times: string[];
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  skipped: boolean;
  skip_reason: string | null;
}

export interface HydrationLog {
  id: string;
  user_id: string;
  logged_at: string;
  amount_oz: number;
  beverage_type: BeverageType;
}

export interface PreshiftRitualSession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  steps_completed: RitualStep[];
  mood_before: number | null;
  mood_after: number | null;
  intention: string | null;
  created_at: string;
}

export interface HealthInsight {
  id: string;
  title: string;
  body: string;
  category: "sleep" | "hydration" | "cycle" | "medication" | "ritual" | "general";
}

export interface HealthHubOverview {
  settings: HealthHubSettings | null;
  todayPulse: DailyPulseLog | null;
  todayHydrationOz: number;
  medicationsDue: number;
  medicationsTakenToday: number;
  todayRitualCount: number;
  latestRitualComplete: boolean;
}
