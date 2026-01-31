import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
import { Check, X, FileSearch } from "lucide-react";

export default async function AlgorithmMarketplaceAdminPage() {
  const algorithms = await prisma.algorithm.findMany({
    orderBy: { popularity: "desc" },
    include: { _count: { select: { userToggles: true } } },
  });

  const columns = [
    { key: "name", header: "Name" },
    { key: "intent", header: "Intent" },
    { key: "popularity", header: "Popularity" },
    { key: "trustScore", header: "Trust" },
    {
      key: "status",
      header: "Status",
      render: () => (
        <span className="rounded-full bg-bettr-mint/50 px-2 py-0.5 text-xs font-medium text-bettr-forest">
          Approved
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="flex gap-1">
          <button type="button" className="rounded p-1 text-slate-600 hover:bg-slate-100" title="Review Metadata">
            <FileSearch className="h-4 w-4" />
          </button>
          <button type="button" className="rounded p-1 text-green-600 hover:bg-green-50" title="Approve">
            <Check className="h-4 w-4" />
          </button>
          <button type="button" className="rounded p-1 text-red-600 hover:bg-red-50" title="Reject">
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <AdminPageHeader
          title="Algorithms"
          description="Manage, approve, and reject feed ranking models. IPFS/Arweave/Solana metadata and health status."
          breadcrumb={[{ label: "Operations", href: "/admin" }, { label: "Algorithms" }]}
        />
        <AdminDataTable
          title="Algorithms — Approve · Reject · Review Metadata"
          columns={columns}
          data={algorithms.map((a) => ({ ...a, status: "", actions: "" }))}
          emptyMessage="No algorithms. Add via API or seed."
        />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Metadata & health</h3>
          <p className="mt-1 text-sm text-slate-600">
            IPFS CID, Arweave pointer, Solana on-chain metadata. Health checks for each algorithm source.
          </p>
        </div>
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
