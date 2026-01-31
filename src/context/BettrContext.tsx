"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { AlgorithmProfile, ScheduleBlock, CurriculumProgress, RewardEntry } from "@/lib/types";
import {
  MOCK_ALGORITHMS,
  MOCK_CURRICULUM,
  MOCK_SCHEDULE_BLOCKS,
} from "@/lib/mock-data";

interface BettrState {
  selectedAlgorithmId: string | null;
  algorithms: AlgorithmProfile[];
  scheduleBlocks: ScheduleBlock[];
  curriculum: CurriculumProgress[];
  rewardBalance: number;
  rewardHistory: RewardEntry[];
  isVerified: boolean;
  activeScheduleBlockId: string | null;
}

interface BettrContextValue extends BettrState {
  setSelectedAlgorithm: (id: string | null) => void;
  toggleAlgorithm: (id: string) => void;
  setScheduleBlocks: (blocks: ScheduleBlock[]) => void;
  setActiveScheduleBlock: (id: string | null) => void;
  addReward: (reason: string, points: number) => void;
}

const defaultState: BettrState = {
  selectedAlgorithmId: "study-mode",
  algorithms: MOCK_ALGORITHMS.map((a) => ({ ...a, active: a.id === "study-mode" })),
  scheduleBlocks: MOCK_SCHEDULE_BLOCKS,
  curriculum: MOCK_CURRICULUM,
  rewardBalance: 420,
  rewardHistory: [
    { id: "r1", reason: "Completed morning focus block", points: 50, date: "2026-01-31" },
    { id: "r2", reason: "Engaged with educational content", points: 20, date: "2026-01-30" },
    { id: "r3", reason: "Scheduled week ahead", points: 30, date: "2026-01-29" },
  ],
  isVerified: true,
  activeScheduleBlockId: "s1",
};

const BettrContext = createContext<BettrContextValue | null>(null);

export function BettrProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BettrState>(defaultState);

  const setSelectedAlgorithm = useCallback((id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedAlgorithmId: id,
      algorithms: prev.algorithms.map((a) => ({ ...a, active: a.id === id })),
    }));
  }, []);

  const toggleAlgorithm = useCallback((id: string) => {
    setState((prev) => {
      const nextId = prev.selectedAlgorithmId === id ? null : id;
      return {
        ...prev,
        selectedAlgorithmId: nextId,
        algorithms: prev.algorithms.map((a) => ({ ...a, active: a.id === nextId })),
      };
    });
  }, []);

  const setScheduleBlocks = useCallback((blocks: ScheduleBlock[]) => {
    setState((prev) => ({ ...prev, scheduleBlocks: blocks }));
  }, []);

  const setActiveScheduleBlock = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeScheduleBlockId: id }));
  }, []);

  const addReward = useCallback((reason: string, points: number) => {
    setState((prev) => ({
      ...prev,
      rewardBalance: prev.rewardBalance + points,
      rewardHistory: [
        { id: `r-${Date.now()}`, reason, points, date: new Date().toISOString().slice(0, 10) },
        ...prev.rewardHistory,
      ],
    }));
  }, []);

  const value: BettrContextValue = {
    ...state,
    setSelectedAlgorithm,
    toggleAlgorithm,
    setScheduleBlocks,
    setActiveScheduleBlock,
    addReward,
  };

  return <BettrContext.Provider value={value}>{children}</BettrContext.Provider>;
}

export function useBettr() {
  const ctx = useContext(BettrContext);
  if (!ctx) throw new Error("useBettr must be used within BettrProvider");
  return ctx;
}
