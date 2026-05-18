import type { Metadata } from "next";
import Image from "next/image";
import { parseISO } from "date-fns";
import { format } from "date-fns";
import { VisionBoardForm } from "@/components/client-dashboard/VisionBoardForm";
import { getClientAppointments, getClientVisionBoards } from "@/lib/client-dashboard/data";
import { requireClientDashboardUser } from "@/lib/dashboard/require-client";

export const metadata: Metadata = {
  title: "Client Vision",
  robots: { index: false, follow: false },
};

export default async function ClientVisionPage() {
  const { user } = await requireClientDashboardUser();
  const [boards, upcoming] = await Promise.all([
    getClientVisionBoards(user.id),
    getClientAppointments(user.id, { upcomingOnly: true, email: user.email ?? undefined }),
  ]);

  const appointmentOptions = upcoming.map((a) => ({
    id: a.id,
    label: `${a.service_name ?? "Appointment"} — ${format(parseISO(a.scheduled_start), "MMM d")}`,
  }));

  return (
    <div className="space-y-10">
      <p className="font-body text-sm text-gold-body">
        Private inspiration boards — shared only with pros you attach to an appointment.
      </p>

      <VisionBoardForm upcomingAppointments={appointmentOptions} />

      <section>
        <h2 className="mb-4 font-heading text-xl text-gold">Your boards</h2>
        {boards.length === 0 ? (
          <p className="font-body text-sm text-cream/70">No vision boards yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {boards.map((b) => (
              <li key={b.id} className="rounded-brand-lg border border-gold/15 bg-navy/50 p-4">
                <h3 className="font-heading text-cream">{b.title ?? "Untitled"}</h3>
                <p className="mt-1 font-body text-xs text-gold-body">
                  {format(parseISO(b.created_at), "MMM d, yyyy")}
                  {b.attached_to_appointment ? " · Attached to appointment" : ""}
                </p>
                {b.notes ? <p className="mt-2 font-body text-sm text-cream/80">{b.notes}</p> : null}
                {b.image_urls?.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {b.image_urls.slice(0, 6).map((url) => (
                      <div key={url} className="relative aspect-square overflow-hidden rounded-md">
                        <Image src={url} alt="" fill className="object-cover" sizes="120px" unoptimized />
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
