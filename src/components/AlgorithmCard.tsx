"use client";

import type { AlgorithmProfile } from "@/lib/types";
import { Check, Zap } from "lucide-react";

interface AlgorithmCardProps {
  algorithm: AlgorithmProfile;
  isActive?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export default function AlgorithmCard({
  algorithm,
  isActive,
  onSelect,
  compact = false,
}: AlgorithmCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border text-left transition ${
        isActive
          ? "border-bettr-forest bg-bettr-mint/50 shadow-sm"
          : "border-bettr-sage/30 bg-white hover:bg-bettr-cream"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-bettr-navy">{algorithm.name}</span>
            {isActive && <Check className="h-4 w-4 shrink-0 text-bettr-forest" />}
          </div>
          {!compact && (
            <p className="mt-1 text-sm text-bettr-navy/70">{algorithm.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded bg-bettr-sage/30 px-1.5 py-0.5 text-xs text-bettr-forest">
              {algorithm.intent}
            </span>
            <span className="text-xs text-bettr-navy/60">
              ↑ {algorithm.popularity}% · trust {algorithm.trustScore}%
            </span>
          </div>
        </div>
        {!compact && (
          <Zap className="h-5 w-5 shrink-0 text-bettr-sage" aria-hidden />
        )}
      </div>
    </button>
  );
}
