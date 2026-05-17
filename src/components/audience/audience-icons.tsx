import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  Calendar,
  Camera,
  ClipboardList,
  CreditCard,
  FileText,
  Heart,
  Layers,
  LineChart,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  Palette,
  Scan,
  Scissors,
  Shield,
  Sparkles,
  Store,
  Target,
  Users,
  Video,
  Wallet,
} from "lucide-react";

const AUDIENCE_ICONS = {
  BadgeCheck,
  BarChart3,
  BookOpen,
  Calendar,
  Camera,
  ClipboardList,
  CreditCard,
  FileText,
  Heart,
  Layers,
  LineChart,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  Palette,
  Scan,
  Scissors,
  Shield,
  Sparkles,
  Store,
  Target,
  Users,
  Video,
  Wallet,
} as const satisfies Record<string, LucideIcon>;

export type AudienceIconName = keyof typeof AUDIENCE_ICONS;

export function getAudienceIcon(name: AudienceIconName): LucideIcon {
  return AUDIENCE_ICONS[name];
}
