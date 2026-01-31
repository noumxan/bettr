import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AlgorithmsPage() {
  const algorithms = await prisma.algorithm.findMany({
    orderBy: { popularity: "desc" },
    include: { _count: { select: { userToggles: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Bounty 2: Decentralized Algorithm Marketplace</h1>
      <p className="text-bettr-navy/70">
        Spotify for algorithms. AT Protocol feed generators (getFeedSkeleton), IPFS/Arweave metadata, Solana pointers. Global News, Peer Highlights, Vocational Upskilling, Social Discovery.
      </p>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-bettr-forest">Algorithms</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {algorithms.map((a) => (
            <div key={a.id} className="rounded-lg border border-bettr-sage/20 bg-bettr-cream/50 p-3">
              <p className="font-medium text-bettr-navy">{a.name}</p>
              <p className="text-sm text-bettr-navy/70">{a.description}</p>
              <p className="mt-1 text-xs text-bettr-navy/60">
                {a.intent} · ↑{a.popularity}% trust {a.trustScore}% · {a._count.userToggles} toggles
              </p>
              {a.ipfsCid && <p className="mt-1 font-mono text-xs text-bettr-forest">IPFS: {a.ipfsCid}</p>}
              {a.solanaMint && <p className="font-mono text-xs text-bettr-forest">Solana: {a.solanaMint}</p>}
            </div>
          ))}
          {algorithms.length === 0 && (
            <p className="col-span-full py-4 text-center text-bettr-navy/60">No algorithms. Run seed or add via API.</p>
          )}
        </div>
      </div>
      <p className="text-sm text-bettr-navy/60">
        API: <code className="rounded bg-bettr-mint/50 px-1">GET /api/feed/skeleton?userId=xxx</code> (AT Protocol style)
      </p>
    </div>
  );
}
