import { prisma } from "@/lib/db";

export async function listBadges() {
  return prisma.badge.findMany({
    orderBy: { focusArea: "asc" },
    include: { _count: { select: { userBadges: true } } },
  });
}

export async function issueBadge(userId: string, badgeId: string, openBadgesJson?: string) {
  return prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId } },
    create: { userId, badgeId },
    update: {},
  });
}

export async function getUserBadges(userId: string) {
  return prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
}

export async function getLeaderboard(limit = 20) {
  const counts = await prisma.userBadge.groupBy({
    by: ["userId"],
    _count: { badgeId: true },
    orderBy: { _count: { badgeId: "desc" } },
    take: limit,
  });
  const userIds = counts.map((c) => c.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, displayName: true, email: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  return counts.map((c) => ({
    userId: c.userId,
    badgeCount: c._count.badgeId,
    user: userMap[c.userId],
  }));
}
