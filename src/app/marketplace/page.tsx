"use client";

import { useBettr } from "@/context/BettrContext";
import AlgorithmCard from "@/components/AlgorithmCard";
import Link from "next/link";

export default function MarketplacePage() {
  const { algorithms, selectedAlgorithmId, setSelectedAlgorithm } = useBettr();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bettr-forest">Algorithm Marketplace</h1>
        <p className="mt-1 text-bettr-navy/70">
          Browse algorithm profiles (not executable ML code). Activate or deactivate to control your feed.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {algorithms.map((alg) => (
          <AlgorithmCard
            key={alg.id}
            algorithm={alg}
            isActive={selectedAlgorithmId === alg.id}
            onSelect={() => setSelectedAlgorithm(alg.id)}
          />
        ))}
      </div>
      <div className="rounded-xl border border-bettr-sage/30 bg-bettr-cream/50 p-4 text-sm text-bettr-navy/80">
        <p>
          <strong>Import/Export (simulated):</strong> In production, you could export your algorithm
          preferences or import community-shared profiles. No real ML code runs in the MVP.
        </p>
      </div>
      <Link
        href="/marketplace/ai"
        className="inline-flex items-center gap-2 rounded-lg bg-bettr-sage px-4 py-2 text-sm font-medium text-white transition hover:bg-bettr-forest"
      >
        Explore AI Assistants & Digital Assets →
      </Link>
    </div>
  );
}
