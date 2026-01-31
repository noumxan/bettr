"use client";

import { useBettr } from "@/context/BettrContext";
import AlgorithmCard from "./AlgorithmCard";

export default function AlgorithmSidePanel() {
  const { algorithms, selectedAlgorithmId, setSelectedAlgorithm } = useBettr();

  return (
    <aside className="w-full shrink-0 rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm lg:w-72">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-bettr-forest">
        Algorithm control
      </h3>
      <p className="mb-3 text-xs text-bettr-navy/70">
        Toggle algorithms on/off. Your feed reorders based on the active algorithm.
      </p>
      <div className="space-y-2">
        {algorithms.map((alg) => (
          <AlgorithmCard
            key={alg.id}
            algorithm={alg}
            isActive={selectedAlgorithmId === alg.id}
            onSelect={() => setSelectedAlgorithm(alg.id)}
            compact
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-bettr-navy/50">
        Preview what other users use in the Marketplace.
      </p>
    </aside>
  );
}
