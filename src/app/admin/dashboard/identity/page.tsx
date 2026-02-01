import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function IdentityPage() {
  const [universities, verifiedCount, metadataCount] = await Promise.all([
    prisma.university.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } } }),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.federationMetadata.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Bounty 1: Institutional Identity and Global Student Onboarding</h1>
      <p className="text-bettr-navy/70">
        Jisc / OpenAthens Keystone, Shibboleth IdP, Discovery Service (WAYF). eduPersonPrincipalName, eduPersonAffiliation, eduPersonScopedAffiliation. GDPR-compliant pseudonymous identifiers.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Verified students</p>
          <p className="text-2xl font-bold text-bettr-forest">{verifiedCount}</p>
        </div>
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Universities</p>
          <p className="text-2xl font-bold text-bettr-forest">{universities.length}</p>
        </div>
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Federation metadata</p>
          <p className="text-2xl font-bold text-bettr-forest">{metadataCount}</p>
        </div>
      </div>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-bettr-forest">University registry</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bettr-sage/30 text-left">
              <th className="py-2">Name</th>
              <th className="py-2">Entity ID</th>
              <th className="py-2">Users</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((u) => (
              <tr key={u.id} className="border-b border-bettr-sage/20">
                <td className="py-2">{u.name}</td>
                <td className="py-2 font-mono text-xs">{u.entityId}</td>
                <td className="py-2">{u._count.users}</td>
              </tr>
            ))}
            {universities.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-bettr-navy/60">
                  No universities. Run seed or add via API.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
