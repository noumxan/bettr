import { getPayoutTotal } from "@/lib/services/rewards";
import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
export default async function MonetizationAdminPage() {
  const [payoutTotal, recentEntries] = await Promise.all([
    getPayoutTotal(),
    prisma.rewardEntry.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const columns = [
    { key: "userId", header: "User", render: (r: { userId: string }) => r.userId.slice(0, 8) + "…" },
    { key: "reason", header: "Reason" },
    { key: "points", header: "Points", render: (r: { points: number }) => `+${r.points}` },
    { key: "createdAt", header: "Date", render: (r: { createdAt: Date }) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monetization & Payouts</h1>
          <p className="mt-1 text-sm text-slate-600">
            Compensation ledger, token payout batches, creator earnings. Admin finance dashboard.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Total distributed</p>
            <p className="text-2xl font-bold text-slate-900">{payoutTotal} pts</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Reward entries</p>
            <p className="text-2xl font-bold text-slate-900">{recentEntries.length}</p>
          </div>
        </div>
        <AdminDataTable
          title="Compensation ledger"
          columns={columns}
          data={recentEntries}
          emptyMessage="No reward entries."
        />
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
