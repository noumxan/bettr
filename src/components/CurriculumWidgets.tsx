"use client";

import { useBettr } from "@/context/BettrContext";
import { Award, BookOpen } from "lucide-react";

export default function CurriculumWidgets() {
  const { curriculum } = useBettr();

  return (
    <div className="rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-bettr-forest">
        <BookOpen className="h-5 w-5" />
        Curriculum of Content
      </h2>
      <p className="mb-4 text-sm text-bettr-navy/70">
        Progress by focus area. Badges are visual only (no real credential issuance).
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {curriculum.map((item) => (
          <div
            key={item.focusArea}
            className="flex items-center gap-3 rounded-lg border border-bettr-sage/30 bg-bettr-cream/50 p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bettr-mint text-bettr-forest">
              {item.badgeUnlocked ? (
                <Award className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">
                  {Math.round((item.completed / item.total) * 100)}%
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-bettr-navy">{item.label}</p>
              <p className="text-sm text-bettr-navy/60">
                {item.completed} / {item.total} completed
                {item.badgeUnlocked && " · Badge unlocked"}
              </p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bettr-sage/30">
                <div
                  className="h-full rounded-full bg-bettr-sage transition-all"
                  style={{ width: `${(item.completed / item.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
