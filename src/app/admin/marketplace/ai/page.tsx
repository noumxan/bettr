import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
export default async function AIAssetsAdminPage() {
  const [assistants, assets] = await Promise.all([
    prisma.aIAssistant.findMany({ orderBy: { name: "asc" } }),
    prisma.digitalAsset.findMany({ orderBy: { name: "asc" } }),
  ]);

  const assistantColumns = [
    { key: "name", header: "AI Mentor" },
    { key: "skillFocus", header: "Focus" },
    { key: "pricing", header: "Pricing" },
  ];

  const assetColumns = [
    { key: "name", header: "Asset" },
    { key: "type", header: "Type" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI & Digital Asset Hub Admin</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage AI mentor listings, NFT assets, pricing tiers. Agent usage and marketplace sales metrics.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-600">AI Assistants</p>
            <p className="text-2xl font-bold text-slate-900">{assistants.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Digital assets</p>
            <p className="text-2xl font-bold text-slate-900">{assets.length}</p>
          </div>
        </div>
        <AdminDataTable
          title="AI mentors"
          columns={assistantColumns}
          data={assistants}
          emptyMessage="No AI assistants."
        />
        <AdminDataTable
          title="Digital assets"
          columns={assetColumns}
          data={assets}
          emptyMessage="No digital assets."
        />
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
