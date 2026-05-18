import type {
  CyclePhase,
  CycleSymptom,
  FlowIntensity,
  MedicationFrequency,
  MedicationPurpose,
  MoodLabel,
  PhysicalFeeling,
  RitualStep,
} from "@/types/health-hub";

export const HEALTH_DISCLAIMER_SHORT =
  "Wellness tracking only — not medical advice. Talk to your healthcare provider for medical decisions.";

export const CYCLE_DISCLAIMER =
  "This is a wellness tracker, not a medical or contraceptive tool. Talk to your doctor for fertility or contraception planning. We do not predict fertility or offer conception advice.";

export const MEDICATION_DISCLAIMER =
  "Tracking only — we do not recommend doses or timing. Talk to your healthcare provider about medications.";

export const HYDRATION_DISCLAIMER =
  "General hydration awareness only. Daily goals stay within 64–100 oz. Talk to your healthcare provider if you have fluid restrictions.";

export const RITUAL_DISCLAIMER =
  "Physical recovery and mindfulness for your workday — not weight loss or extreme diet advice.";

export const PRIVACY_REMINDER =
  "Your health data is private to you. Sif's Gold cannot see or share this data with brand partners, advertisers, or third parties.";

export const OPT_IN_HEADLINE = "Health Hub is optional";
export const OPT_IN_BODY =
  "Enable only the trackers you want. We never sell, share, or use Health Hub data for advertising. All notes are encrypted at rest in your account.";

export const MOOD_OPTIONS: { value: MoodLabel; label: string; emoji: string }[] = [
  { value: "great", label: "Great", emoji: "✨" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "low", label: "Low", emoji: "😔" },
  { value: "rough", label: "Rough", emoji: "💙" },
];

export const PHYSICAL_FEELING_OPTIONS: { value: PhysicalFeeling; label: string }[] = [
  { value: "rested", label: "Rested" },
  { value: "sore", label: "Sore" },
  { value: "achy", label: "Achy" },
  { value: "tense", label: "Tense" },
  { value: "energized", label: "Energized" },
];

export const FLOW_OPTIONS: { value: FlowIntensity; label: string }[] = [
  { value: "none", label: "None" },
  { value: "spotting", label: "Spotting" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
];

export const SYMPTOM_OPTIONS: { value: CycleSymptom; label: string }[] = [
  { value: "cramps", label: "Cramps" },
  { value: "headache", label: "Headache" },
  { value: "bloating", label: "Bloating" },
  { value: "breast_tenderness", label: "Breast tenderness" },
  { value: "mood_swings", label: "Mood shifts" },
];

export const PHASE_OPTIONS: { value: CyclePhase; label: string; tip: string }[] = [
  {
    value: "menstrual",
    label: "Menstrual",
    tip: "Prioritize rest, gentle movement, and warmth. Listen to your body.",
  },
  {
    value: "follicular",
    label: "Follicular",
    tip: "Energy often rises — good time for planning and lighter intensity work.",
  },
  {
    value: "ovulatory",
    label: "Ovulatory",
    tip: "You may feel more social energy. Stay hydrated and pace long days.",
  },
  {
    value: "luteal",
    label: "Luteal",
    tip: "Wind down earlier when you can. Extra rest and steady meals can help.",
  },
];

export const FREQUENCY_OPTIONS: { value: MedicationFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "as_needed", label: "As needed" },
  { value: "weekly", label: "Weekly" },
];

export const PURPOSE_OPTIONS: { value: MedicationPurpose; label: string }[] = [
  { value: "allergies", label: "Allergies" },
  { value: "birth_control", label: "Birth control" },
  { value: "mental_health", label: "Mental health" },
  { value: "pain", label: "Pain" },
  { value: "other", label: "Other" },
];

export const HYDRATION_QUICK_OZ = [8, 12, 16, 20] as const;

export const HYDRATION_GOAL_MIN = 64;
export const HYDRATION_GOAL_MAX = 100;
export const HYDRATION_GOAL_DEFAULT = 64;

export const RITUAL_STEPS: {
  id: RitualStep;
  title: string;
  durationSec: number;
  description: string;
}[] = [
  {
    id: "breathwork",
    title: "Breathwork",
    durationSec: 60,
    description: "4-7-8 box breathing — inhale 4, hold 7, exhale 8.",
  },
  {
    id: "stretch_wrists",
    title: "Wrist & hands",
    durationSec: 60,
    description: "Gentle circles and flex stretches for hands and wrists.",
  },
  {
    id: "stretch_back",
    title: "Back stretches",
    durationSec: 60,
    description: "Cat-cow and shoulder rolls — move within comfort.",
  },
  {
    id: "mindset_check",
    title: "Mindset check",
    durationSec: 60,
    description: "How do you want to show up for your clients today?",
  },
  {
    id: "hydration",
    title: "Hydration check",
    durationSec: 30,
    description: "Log a glass of water before your shift.",
  },
  {
    id: "intentions",
    title: "Final intention",
    durationSec: 30,
    description: "One-line affirmation for today's work.",
  },
];

export const REAUTH_INTERVALS: { value: 1 | 5 | 15 | 60; label: string }[] = [
  { value: 1, label: "1 minute" },
  { value: 5, label: "5 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 60, label: "1 hour" },
];

export const HEALTH_HUB_NAV = [
  { href: "/dashboard/health-hub", label: "Overview", exact: true },
  { href: "/dashboard/health-hub/daily-pulse", label: "Daily Pulse" },
  { href: "/dashboard/health-hub/cycle-sync", label: "Cycle Sync" },
  { href: "/dashboard/health-hub/medications", label: "Medications" },
  { href: "/dashboard/health-hub/hydration", label: "Hydration" },
  { href: "/dashboard/health-hub/pre-shift", label: "Pre-shift Ritual" },
  { href: "/dashboard/health-hub/insights", label: "Insights" },
  { href: "/dashboard/health-hub/settings", label: "Settings" },
  { href: "/dashboard/health-hub/disclaimer", label: "Disclaimer" },
] as const;

export const REAUTH_COOKIE = "health_hub_reauth_at";
