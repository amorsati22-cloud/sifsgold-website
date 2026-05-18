"use client";

import { useState } from "react";
import { InviteStaffModal } from "@/components/salon/InviteStaffModal";
import { SalonTeamRoster } from "@/components/salon/SalonTeamRoster";
import type { SalonStaff } from "@/types/salon";

type Props = { salonId: string; staff: SalonStaff[] };

export function SalonTeamPageClient({ salonId, staff }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <SalonTeamRoster salonId={salonId} staff={staff} onInvite={() => setInviteOpen(true)} />
      <InviteStaffModal salonId={salonId} open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
