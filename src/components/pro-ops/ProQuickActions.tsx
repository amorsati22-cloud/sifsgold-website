import { GoldButton } from "@/components/ui/GoldButton";

export function ProQuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <GoldButton label="Add walk-in" href="/dashboard/pro/schedule" variant="solid" size="md" />
      <GoldButton label="Block time" href="/dashboard/availability" variant="outlined" size="md" />
      <GoldButton label="Message client" href="/dashboard/pro/messages" variant="outlined" size="md" />
    </div>
  );
}
