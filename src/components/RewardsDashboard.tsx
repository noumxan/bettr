"use client";

import { useBettr } from "@/context/BettrContext";
import { Gift, Info } from "lucide-react";

export default function RewardsDashboard() {
  const { rewardBalance, rewardHistory } = useBettr();

  return (
    <div className="rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-bettr-forest">
        <Gift className="h-5 w-5" />
        Rewards
      </h2>
      <p className="mb-4 text-sm text-bettr-navy/70">
        Earn points for completing scheduled blocks and engaging with positive content. Crypto, Solana Pay, ZKP logic explained but not executed in MVP.
      </p>
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-bettr-mint/50 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bettr-sage text-bettr-forest">
          <Gift className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-bettr-navy/70">Current balance</p>
          <p className="text-2xl font-bold text-bettr-forest">{rewardBalance} pts</p>
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-bettr-sage/30 bg-bettr-cream/50 p-3 text-sm text-bettr-navy/80">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          Future: Solana Pay, Token-2022, ZK proofs for privacy-preserving rewards. Architecture is integration-ready.
        </span>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-bettr-navy">History</h3>
      <ul className="mt-2 space-y-2">
        {rewardHistory.slice(0, 5).map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between rounded border border-bettr-sage/20 bg-white px-3 py-2 text-sm"
          >
            <span className="text-bettr-navy/90">{entry.reason}</span>
            <span className="font-medium text-bettr-forest">+{entry.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
