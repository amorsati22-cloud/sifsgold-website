import Link from "next/link";
import { logAdminAudit } from "@/lib/admin/audit";
import { requireAdminPage } from "@/lib/admin/auth";
import { FOUNDING_MEMBER_CAP } from "@/lib/admin/overview";

export default async function AdminFoundingMembersPage() {
  const { admin, email } = await requireAdminPage();

  const { data: members } = await admin
    .from("profiles")
    .select("id, email, full_name, founding_member_at, created_at, user_type")
    .eq("founding_member", true)
    .order("founding_member_at", { ascending: true });

  await logAdminAudit({
    admin,
    adminEmail: email,
    action: "viewed_founding_members",
    metadata: { count: members?.length ?? 0 },
  });

  const count = members?.length ?? 0;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gold">Founding members</h1>
          <p className="mt-2 font-body text-cream/80">
            {count} of {FOUNDING_MEMBER_CAP} launch cap enrolled in The Gold Collective.
          </p>
        </div>
        <Link
          href="/api/admin/founding-members/export"
          className="rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10"
        >
          Export roster CSV
        </Link>
      </header>

      <div className="mt-8 overflow-x-auto rounded-brand-lg border border-gold/15">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gold/15 bg-navy-deep/80 text-gold-body">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">User type</th>
              <th className="px-3 py-2">Founding since</th>
            </tr>
          </thead>
          <tbody>
            {(members ?? []).map((m) => (
              <tr key={m.id as string} className="border-b border-gold/10 text-cream/90">
                <td className="px-3 py-2">{m.email as string}</td>
                <td className="px-3 py-2">{(m.full_name as string) ?? "—"}</td>
                <td className="px-3 py-2">{(m.user_type as string) ?? "—"}</td>
                <td className="px-3 py-2">
                  {m.founding_member_at
                    ? new Date(m.founding_member_at as string).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
