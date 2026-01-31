"use client";

import Link from "next/link";
import { useBettr } from "@/context/BettrContext";
import { Gift, GraduationCap } from "lucide-react";

export default function HomeSummary() {
  const { rewardBalance, curriculum } = useBettr();
  const completed = curriculum.filter((c) => c.badgeUnlocked).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/rewards"
        className="flex items-center gap-4 rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bettr-mint text-bettr-forest">
          <Gift className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-bettr-navy/70">Rewards</p>
          <p className="text-lg font-semibold text-bettr-forest">{rewardBalance} pts</p>
        </div>
      </Link>
      <Link
        href="/curriculum"
        className="flex items-center gap-4 rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bettr-sage text-bettr-forest">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-bettr-navy/70">Curriculum</p>
          <p className="text-lg font-semibold text-bettr-forest">{completed} badges unlocked</p>
        </div>
      </Link>
    </div>
  );
}
