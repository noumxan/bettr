"use client";

import { useMemo } from "react";
import { MOCK_FEED_ITEMS } from "@/lib/mock-data";
import { useBettr } from "@/context/BettrContext";
import type { FeedItem } from "@/lib/types";
import FeedCard from "./FeedCard";

export default function BettrFeed() {
  const { selectedAlgorithmId } = useBettr();

  // Feed ranking changes dynamically based on selected algorithm (state-based, no real ML)
  const orderedFeed = useMemo(() => {
    const items = [...MOCK_FEED_ITEMS];
    if (!selectedAlgorithmId) return items;
    if (selectedAlgorithmId === "study-mode") {
      return items.sort((a, b) => (b.focusArea ? 1 : 0) - (a.focusArea ? 1 : 0));
    }
    if (selectedAlgorithmId === "news-digest") {
      return items.sort((a, b) =>
        (a.contentType === "journalism" ? -1 : 0) - (b.contentType === "journalism" ? -1 : 0)
      );
    }
    if (selectedAlgorithmId === "wellness-flow") {
      return items.sort((a, b) => {
        const order = ["mental-health", "physical-health", "nutrition"];
        const ai = order.indexOf(a.focusArea || "");
        const bi = order.indexOf(b.focusArea || "");
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
    }
    return items;
  }, [selectedAlgorithmId]);

  return (
    <div className="feed-container space-y-4 rounded-xl bg-white/60 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-bettr-forest">Bettr Feed</h2>
      <p className="text-sm text-bettr-navy/70">
        Content order is driven by your active algorithm. Switch in the side panel to see changes.
      </p>
      <div className="space-y-3">
        {(orderedFeed as FeedItem[]).map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
