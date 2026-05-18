"use client";

import { DayPicker } from "react-day-picker";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { CycleLog } from "@/types/health-hub";
import "react-day-picker/dist/style.css";

export function CycleCalendar({ logs }: { logs: CycleLog[] }) {
  const theme = useTheme();
  const loggedDates = logs.map((l) => new Date(l.log_date + "T12:00:00"));

  return (
    <div
      className="rounded-brand-lg border border-gold/15 bg-navy-deep/70 p-4 [&_.rdp]:mx-auto [&_.rdp-day]:text-cream [&_.rdp-caption_label]:text-gold [&_.rdp-head_cell]:text-goldBody [&_.rdp-nav_button]:text-gold"
      style={
        {
          "--rdp-accent-color": theme.colors.gold,
          "--rdp-background-color": theme.colors.navyDeep,
        } as React.CSSProperties
      }
    >
      <DayPicker
        mode="multiple"
        selected={loggedDates}
        modifiersClassNames={{
          selected: "bg-gold/30 text-gold font-semibold rounded-full",
        }}
        showOutsideDays
        fixedWeeks
      />
      <p className="mt-3 text-center font-body text-xs text-cream/60">
        Highlighted days have a log entry. No fertility or conception predictions.
      </p>
    </div>
  );
}
