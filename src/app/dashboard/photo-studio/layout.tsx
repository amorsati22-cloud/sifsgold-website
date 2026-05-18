import type { Metadata } from "next";
import { PhotoStudioShell } from "@/components/photo-studio/PhotoStudioShell";
import { requireProDashboardUser } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Photo Studio",
  robots: { index: false, follow: false },
};

export default async function PhotoStudioLayout({ children }: { children: React.ReactNode }) {
  await requireProDashboardUser();
  return <PhotoStudioShell>{children}</PhotoStudioShell>;
}
