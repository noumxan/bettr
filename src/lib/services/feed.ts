import { prisma } from "@/lib/db";
import type { Algorithm } from "@prisma/client";

/**
 * AT Protocol–style feed skeleton: returns ordered feed item IDs
 * for the given user and algorithm. Student app consumes this.
 */
export async function getFeedSkeleton(userId: string, limit = 50) {
  const toggles = await prisma.userAlgorithmToggle.findMany({
    where: { userId, active: true },
    include: { algorithm: true },
  });
  const activeAlgorithm = toggles.find((t) => t.active)?.algorithm ?? null;

  // In a full implementation we'd have a FeedItem table and rank by algorithm.
  // For now return a stable skeleton keyed by algorithm intent.
  const intent = (activeAlgorithm?.intent as string) ?? "social";
  // Placeholder: real implementation would query posts/activities and rank.
  return {
    feed: [] as string[],
    cursor: null as string | null,
    algorithm: activeAlgorithm ? { id: activeAlgorithm.id, name: activeAlgorithm.name, intent } : null,
  };
}

export function rankFeedByAlgorithm(
  itemIds: string[],
  algorithm: Algorithm | null
): string[] {
  if (!algorithm) return itemIds;
  // State-based ranking (no real ML). Reorder by intent rules.
  switch (algorithm.intent) {
    case "study":
      return [...itemIds].reverse();
    case "news":
      return itemIds;
    default:
      return itemIds;
  }
}
