import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpen,
  Brain,
  Calendar,
  Camera,
  CreditCard,
  FileText,
  GraduationCap,
  Heart,
  Lock,
  Map,
  Music,
  Package,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  Wallet,
} from "lucide-react";

const FEATURE_LUCIDE = {
  BadgeCheck,
  Calendar,
  Heart,
  Camera,
  Music,
  GraduationCap,
  Users,
  CreditCard,
  Shield,
  Sparkles,
  Brain,
  BookOpen,
  Map,
  ShoppingBag,
  Store,
  Wallet,
  Package,
  FileText,
  Lock,
} as const satisfies Record<string, LucideIcon>;

export type FeatureLucideName = keyof typeof FEATURE_LUCIDE;

export function getFeatureLucide(name: string): LucideIcon {
  const icon = FEATURE_LUCIDE[name as FeatureLucideName];
  return icon ?? Sparkles;
}
