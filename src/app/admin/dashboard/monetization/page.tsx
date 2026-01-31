import { getPayoutTotal } from "@/lib/services/rewards";
import { prisma } from "@/lib/db";

export default async function MonetizationPage() {
  const [payoutTotal, recentPayouts, rewardCount] = await Promise.all([
    getPayoutTotal(),
    prisma.rewardEntry.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.rewardEntry.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Bounty 4: The Bettr Monetization Engine</h1>
      <p className="text-bettr-navy/70">
        Solana Pay, Token-2022, confidential transfers / ZKP placeholders. User data compensation ledger, creator payouts.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Payout total (points)</p>
          <p className="text-2xl font-bold text-bettr-forest">{payoutTotal}</p>
        </div>
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Reward entries</p>
          <p className="text-2xl font-bold text-bettr-forest">{rewardCount}</p>
        </div>
      </div>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-bettr-forest">Recent reward ledger</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bettr-sage/30 text-left">
              <th className="py-2">User ID</th>
              <th className="py-2">Reason</th>
              <th className="py-2">Points</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPayouts.map((r) => (
              <tr key={r.id} className="border-b border-bettr-sage/20">
                <td className="py-2 font-mono text-xs">{r.userId.slice(0, 8)}…</td>
                <td className="py-2">{r.reason}</td>
                <td className="py-2">+{r.points}</td>
                <td className="py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {recentPayouts.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-bettr-navy/60">No reward entries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
