import { prisma } from "@/lib/db";

export async function addReward(userId: string, reason: string, points: number, txSignature?: string) {
  return prisma.rewardEntry.create({
    data: { userId, reason, points, txSignature },
  });
}

export async function getRewardHistory(userId: string, limit = 50) {
  return prisma.rewardEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRewardBalance(userId: string) {
  const agg = await prisma.rewardEntry.aggregate({
    where: { userId },
    _sum: { points: true },
  });
  return agg._sum.points ?? 0;
}

export async function getPayoutTotal() {
  const agg = await prisma.rewardEntry.aggregate({ _sum: { points: true } });
  return agg._sum.points ?? 0;
}
