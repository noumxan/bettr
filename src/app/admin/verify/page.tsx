import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
export default async function StudentOnboardingAdminPage() {
  const [universities, metadata] = await Promise.all([
    prisma.university.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } } }),
    prisma.federationMetadata.findMany({ take: 10 }),
  ]);

  const columns = [
    { key: "name", header: "Institution" },
    { key: "entityId", header: "Entity ID", render: (r: { entityId: string }) => <span className="font-mono text-xs">{r.entityId}</span> },
    { key: "users", header: "Users", render: (r: { _count: { users: number } }) => r._count.users },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Student Onboarding Admin</h1>
          <p className="mt-1 text-sm text-slate-600">
            Jisc/OpenAthens SSO config, attribute release, WAYF mapping, institution registry. Audit verified students.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">SSO & federation</h3>
          <p className="mt-1 text-sm text-slate-600">
            Configure auth providers, Shibboleth IdP attributes (eduPersonPrincipalName, eduPersonAffiliation), OpenAthens Keystone (OIDC ↔ SAML). WAYF discovery service.
          </p>
        </div>
        <AdminDataTable
          title="Institution registry"
          columns={columns}
          data={universities}
          emptyMessage="No universities."
        />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Federation metadata</h3>
          <p className="mt-1 text-sm text-slate-600">{metadata.length} metadata entries (IdP/SP).</p>
        </div>
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
