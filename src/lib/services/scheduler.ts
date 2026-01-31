import { prisma } from "@/lib/db";

export async function getScheduleBlocks(userId: string) {
  return prisma.scheduleBlock.findMany({
    where: { userId },
    include: { algorithm: true },
    orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }],
  });
}

export async function createScheduleBlock(data: {
  userId: string;
  algorithmId: string;
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  label?: string;
}) {
  return prisma.scheduleBlock.create({ data });
}

export async function updateScheduleBlock(
  blockId: string,
  data: { algorithmId?: string; label?: string }
) {
  return prisma.scheduleBlock.update({
    where: { id: blockId },
    data,
    include: { algorithm: true },
  });
}

export async function deleteScheduleBlock(id: string) {
  return prisma.scheduleBlock.delete({ where: { id } });
}

/**
 * Cron-style: get users whose current time block should switch algorithm.
 * Backend cron calls this and triggers algorithm switch (e.g. via API).
 */
export async function getUsersDueForAlgorithmSwitch(
  dayOfWeek: number,
  hour: number
) {
  const blocks = await prisma.scheduleBlock.findMany({
    where: {
      dayOfWeek,
      startHour: { lte: hour },
      endHour: { gt: hour },
    },
    include: { user: true, algorithm: true },
  });
  return blocks;
}
