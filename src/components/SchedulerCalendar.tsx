"use client";

import { useMemo } from "react";
import { useBettr } from "@/context/BettrContext";
import type { ScheduleBlock } from "@/lib/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function SchedulerCalendar() {
  const { scheduleBlocks, algorithms } = useBettr();

  const algorithmNames = useMemo(() => {
    const map: Record<string, string> = {};
    algorithms.forEach((a) => (map[a.id] = a.name));
    return map;
  }, [algorithms]);

  const blocksByDay = useMemo(() => {
    const byDay: Record<number, ScheduleBlock[]> = {};
    scheduleBlocks.forEach((b) => {
      if (!byDay[b.day]) byDay[b.day] = [];
      byDay[b.day].push(b);
    });
    Object.keys(byDay).forEach((d) => byDay[Number(d)].sort((a, b) => a.startHour - b.startHour));
    return byDay;
  }, [scheduleBlocks]);

  return (
    <div className="rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-bettr-forest">Content schedule</h2>
      <p className="mb-4 text-sm text-bettr-navy/70">
        Assign algorithms to time blocks. Feed switches automatically based on schedule (simulated).
      </p>
      <div className="overflow-x-auto">
        <div className="grid min-w-[600px] grid-cols-8 gap-2">
          <div className="col-span-1 text-xs font-medium text-bettr-navy/60">Time</div>
          {DAYS.map((day, i) => (
            <div key={day} className="text-center text-xs font-medium text-bettr-navy">
              {day}
            </div>
          ))}
          <div className="col-span-1 grid grid-rows-[repeat(25,minmax(0,1fr))] gap-0 text-xs text-bettr-navy/50">
            {HOURS.map((h) => (
              <div key={h} className="py-0.5">
                {h}:00
              </div>
            ))}
          </div>
          {DAYS.map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="relative grid grid-rows-[repeat(25,minmax(0,1fr))] gap-0.5 rounded border border-bettr-sage/20 bg-bettr-cream/50"
            >
              {(blocksByDay[dayIndex] || []).map((block) => {
                const start = block.startHour + 1;
                const span = block.endHour - block.startHour;
                const color =
                  block.algorithmId === "study-mode"
                    ? "bg-bettr-mint"
                    : block.algorithmId === "news-digest"
                      ? "bg-bettr-sage/70"
                      : block.algorithmId === "social-discovery"
                        ? "bg-bettr-coral/60"
                        : "bg-bettr-forest/20";
                return (
                  <div
                    key={block.id}
                    className={`absolute inset-x-1 rounded py-1 px-2 text-xs ${color} shadow-sm`}
                    style={{
                      top: `calc(${(block.startHour / 24) * 100}%)`,
                      height: `calc(${(span / 24) * 100}%)`,
                    }}
                    title={`${algorithmNames[block.algorithmId] || block.algorithmId} — ${block.label}`}
                  >
                    <span className="font-medium text-bettr-navy">
                      {algorithmNames[block.algorithmId] || block.algorithmId}
                    </span>
                    <span className="block truncate text-bettr-navy/70">{block.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
