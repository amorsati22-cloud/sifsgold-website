import type { Metadata } from "next";
import Link from "next/link";
import { parseISO } from "date-fns";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { ClientNotesForm } from "@/components/pro-ops/ClientNotesForm";
import { GoldButton } from "@/components/ui/GoldButton";
import { getBookingUrl } from "@/lib/booking";
import { getDashboardProProfile, requireProDashboardUser } from "@/lib/dashboard";
import { getProClientDetail } from "@/lib/pro-ops/data";

export const metadata: Metadata = {
  title: "Client profile",
  robots: { index: false, follow: false },
};

type Props = { params: { client_id: string } };

export default async function ProClientDetailPage({ params }: Props) {
  const { user } = await requireProDashboardUser();
  const profile = await getDashboardProProfile(user.id);
  const detail = await getProClientDetail(user.id, decodeURIComponent(params.client_id));

  if (!detail) notFound();

  const { client, notes, appointments, totalSpent, avgTicket } = detail;

  return (
    <div className="space-y-8">
      <nav className="font-body text-sm text-gold-body">
        <Link href="/dashboard/pro/clients" className="hover:text-gold">
          Clients
        </Link>
        <span className="mx-2 text-cream/40">/</span>
        <span className="text-cream">{client.display_name}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-gold">{client.display_name}</h1>
          <p className="mt-1 font-body text-sm text-cream/80">{client.email ?? "No email on file"}</p>
          {client.phone ? <p className="font-body text-sm text-cream/80">{client.phone}</p> : null}
          <p className="mt-3 font-body text-sm text-gold">
            ${totalSpent.toFixed(0)} total · ${avgTicket.toFixed(0)} avg ticket · {client.appointment_count}{" "}
            visits
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GoldButton
            label="Send message"
            href={`/dashboard/messages/new?to=${encodeURIComponent(client.client_id ?? client.id)}`}
            variant="outlined"
            size="md"
          />
          {profile?.username ? (
            <GoldButton
              label="Book again"
              href={getBookingUrl(profile.username)}
              variant="solid"
              size="md"
            />
          ) : null}
        </div>
      </header>

      <ClientNotesForm
        proId={user.id}
        clientKey={client.id}
        clientId={client.client_id}
        guestKey={client.guest_key}
        guestName={client.display_name}
        guestEmail={client.email}
        guestPhone={client.phone}
        initial={notes}
      />

      <section>
        <h2 className="mb-4 font-heading text-lg text-gold">Appointment history</h2>
        <ul className="space-y-2">
          {appointments.map((a) => {
            const svc = a.services as { name: string } | null;
            return (
              <li
                key={a.id as string}
                className="flex flex-wrap justify-between gap-2 rounded-brand-lg border border-gold/10 bg-navy/40 px-4 py-3 font-body text-sm"
              >
                <span className="text-cream">{svc?.name ?? "Appointment"}</span>
                <span className="text-gold-body">
                  {format(parseISO(a.scheduled_start as string), "MMM d, yyyy")} · {a.status as string}
                </span>
              </li>
            );
          })}
        </ul>
        {appointments.length === 0 ? (
          <p className="font-body text-sm text-gold-body">No appointments yet.</p>
        ) : null}
      </section>
    </div>
  );
}
