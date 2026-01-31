import { prisma } from "@/lib/db";

export async function listAlgorithms() {
  return prisma.algorithm.findMany({
    orderBy: { popularity: "desc" },
    include: { _count: { select: { userToggles: true } } },
  });
}

export async function getAlgorithm(id: string) {
  return prisma.algorithm.findUnique({ where: { id } });
}

export async function createAlgorithm(data: {
  name: string;
  description: string;
  intent: string;
  popularity?: number;
  trustScore?: number;
  ipfsCid?: string;
  solanaMint?: string;
}) {
  return prisma.algorithm.create({ data });
}

export async function toggleUserAlgorithm(userId: string, algorithmId: string, active: boolean) {
  return prisma.userAlgorithmToggle.upsert({
    where: { userId_algorithmId: { userId, algorithmId } },
    create: { userId, algorithmId, active },
    update: { active },
  });
}

export async function getActiveAlgorithmForUser(userId: string) {
  const toggle = await prisma.userAlgorithmToggle.findFirst({
    where: { userId, active: true },
    include: { algorithm: true },
  });
  return toggle?.algorithm ?? null;
}
