import type { Metadata } from "next";
import Link from "next/link";
import { requireSchoolDashboardUser } from "@/lib/schools/require-school";

export const metadata: Metadata = {
  title: "School settings",
  robots: { index: false, follow: false },
};

export default async function SchoolSettingsPage() {
  const { school } = await requireSchoolDashboardUser();
  const publicUrl = school.slug ? `/school/${school.slug}` : `/school/${school.id}`;

  return (
    <div className="max-w-xl space-y-4 font-body text-sm">
      <p className="text-cream/80">
        School: <strong className="text-gold">{school.name}</strong>
      </p>
      <p className="text-gold-body">Accreditation: {school.accreditation ?? "Not set"}</p>
      <p className="text-gold-body">State: {school.state}</p>
      <p className="text-gold-body">Tier: {school.subscription_tier ?? "school-free"}</p>
      <Link href={publicUrl} className="text-gold hover:underline">
        Public profile →
      </Link>
      <p className="text-xs text-gold-body">
        FERPA: student records are only visible to the student, assigned instructors, and school administrators.
      </p>
    </div>
  );
}
