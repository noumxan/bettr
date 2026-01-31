import { prisma } from "@/lib/db";

export async function getMetrics() {
  try {
    const [verifiedCount, algorithmCount, scheduleCount, rewardSum, badgeCount, aiCount, assetCount] =
      await Promise.all([
        prisma.user.count({ where: { isVerified: true } }),
        prisma.algorithm.count(),
        prisma.scheduleBlock.count(),
        prisma.rewardEntry.aggregate({ _sum: { points: true } }),
        prisma.userBadge.count(),
        prisma.aIAssistant.count(),
        prisma.digitalAsset.count(),
      ]);
    return {
      verifiedStudents: verifiedCount,
      activeAlgorithms: algorithmCount,
      scheduledFeeds: scheduleCount,
      payoutTotal: rewardSum._sum.points ?? 0,
      badgesEarned: badgeCount,
      aiAndAssets: aiCount + assetCount,
    };
  } catch {
    return {
      verifiedStudents: 0,
      activeAlgorithms: 0,
      scheduledFeeds: 0,
      payoutTotal: 0,
      badgesEarned: 0,
      aiAndAssets: 0,
    };
  }
}
