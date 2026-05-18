import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoldButton } from "@/components/ui/GoldButton";
import { formatSchoolAddress, getPublicSchool } from "@/lib/schools/data";

type Props = { params: { school_id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPublicSchool(params.school_id);
  if (!data) return { title: "School not found" };
  return {
    title: data.school.name,
    description: data.school.description ?? `${data.school.name} — accredited beauty education.`,
  };
}

export default async function PublicSchoolPage({ params }: Props) {
  const data = await getPublicSchool(params.school_id);
  if (!data) notFound();

  const { school, cohorts } = data;
  const address = formatSchoolAddress(school);

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-heading text-4xl text-gold">{school.name}</h1>
        {school.accreditation ? (
          <p className="mt-2 font-body text-sm text-gold">Accredited: {school.accreditation}</p>
        ) : null}
        {school.description ? (
          <p className="mt-3 max-w-2xl font-body text-cream/85">{school.description}</p>
        ) : null}
        {address ? <p className="mt-2 font-body text-sm text-gold-body">{address}</p> : null}
        {school.phone ? <p className="font-body text-sm text-gold-body">{school.phone}</p> : null}
        {school.email ? (
          <a href={`mailto:${school.email}`} className="font-body text-sm text-gold hover:underline">
            {school.email}
          </a>
        ) : null}
      </header>

      <section>
        <h2 className="mb-4 font-heading text-2xl text-gold">Programs</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {cohorts.map((c) => (
            <li key={c.id} className="rounded-brand-lg border border-gold/15 bg-navy/30 p-4">
              <p className="font-body font-medium text-cream">{c.name}</p>
              <p className="mt-1 font-body text-xs capitalize text-gold-body">
                {c.program_type} · {c.required_hours} hours · {c.state}
              </p>
            </li>
          ))}
        </ul>
        {cohorts.length === 0 ? (
          <p className="font-body text-sm text-gold-body">Contact the school for enrollment.</p>
        ) : null}
      </section>

      <div className="mt-10 text-center">
        <GoldButton label="Request enrollment info" href="/contact" variant="solid" size="md" />
      </div>
    </div>
  );
}
