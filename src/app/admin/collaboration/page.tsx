import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";

export const dynamic = "force-dynamic";

export default async function CollaborationAdminPage() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  const columns = [
    { key: "name", header: "Workspace" },
    { key: "members", header: "Members" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">University Collaboration Hub</h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure shared workspaces for partner universities. Groups, research clusters, faculty spaces.
          </p>
        </div>
        <AdminDataTable
          title="Workspaces"
          columns={columns}
          data={workspaces.map((w) => ({ ...w, members: w._count.members }))}
          emptyMessage="No workspaces."
        />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Configure</h3>
          <p className="mt-1 text-sm text-slate-600">
            Admins can create workspaces, assign members, and link to universities.
          </p>
        </div>
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
