"use client";

import Link from "next/link";
import type { SalonStaff } from "@/types/salon";
import { GoldButton } from "@/components/ui/GoldButton";

type Props = {
  salonId: string;
  staff: SalonStaff[];
  onInvite: () => void;
};

export function SalonTeamRoster({ salonId, staff, onInvite }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl text-gold">Team roster</h2>
        <GoldButton label="+ Add team member" onClick={onInvite} variant="solid" size="md" />
      </div>
      <div className="overflow-x-auto rounded-brand-lg border border-gold/15">
        <table className="w-full min-w-[640px] font-body text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left text-gold-body">
              <th className="px-4 py-3">Pro</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Split / rent</th>
              <th className="px-4 py-3">This week</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-gold/10 hover:bg-white/5">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/salon/team/${s.pro_id}`}
                    className="flex items-center gap-2 text-cream hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span
                      className="h-8 w-8 rounded-full bg-gold/20"
                      style={{ boxShadow: `inset 0 0 0 2px ${s.calendar_color ?? "#D4A843"}` }}
                      aria-hidden
                    />
                    {s.display_name}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-cream/90">{s.role}</td>
                <td className="px-4 py-3 text-gold-body">
                  {s.commission_split != null ? `${s.commission_split}%` : "—"}
                  {s.booth_rent_amount
                    ? ` · $${s.booth_rent_amount}/${s.booth_rent_frequency ?? "mo"}`
                    : ""}
                </td>
                <td className="px-4 py-3 text-gold">${(s.week_revenue ?? 0).toFixed(0)}</td>
                <td className="px-4 py-3 capitalize text-cream/80">{s.status.replace("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
