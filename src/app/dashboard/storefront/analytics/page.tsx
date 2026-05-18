"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { STOREFRONT_NAV } from "@/lib/dashboard/storefront-nav";
import { useTheme } from "@/components/theme/ThemeProvider";

const SAMPLE_DATA = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6200 },
];

export default function StorefrontAnalyticsPage() {
  const theme = useTheme();

  return (
    <DashboardShell title="Analytics" description="Revenue and performance for your Gold Partner storefront." nav={STOREFRONT_NAV}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Revenue (30d)" value="$6,200" />
        <Stat label="Avg order value" value="$84" />
        <Stat label="Conversion rate" value="3.2%" />
      </div>
      <div className="mt-8 h-64 rounded-brand-md border border-gold/15 bg-navy-lift p-4">
        <h2 className="mb-4 font-heading text-lg text-gold">Revenue</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={SAMPLE_DATA}>
            <XAxis dataKey="month" stroke={theme.colors.goldBody} fontSize={12} />
            <YAxis stroke={theme.colors.goldBody} fontSize={12} />
            <Tooltip contentStyle={{ background: theme.colors.navyLift, border: `1px solid ${theme.colors.gold}` }} />
            <Bar dataKey="revenue" fill={theme.colors.gold} radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-6 font-body text-sm text-gold-body">
        Customer demographics are anonymized aggregate insights for Gold Partners — never individual client surveillance.
      </p>
    </DashboardShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-md border border-gold/20 bg-navy-lift p-4">
      <p className="font-body text-xs text-gold-body">{label}</p>
      <p className="font-heading text-2xl text-gold">{value}</p>
    </div>
  );
}
