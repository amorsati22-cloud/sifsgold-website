"use client";

import { NotificationBell } from "./NotificationBell";
import { NotificationToast } from "./NotificationToast";

export function DashboardNotifications({ userId }: { userId: string }) {
  return (
    <>
      <NotificationBell />
      <NotificationToast userId={userId} />
    </>
  );
}
