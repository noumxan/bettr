import { prisma } from "@/lib/db";

export async function getUniversities() {
  return prisma.university.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } } });
}

export async function getFederationMetadata(entityId: string) {
  return prisma.federationMetadata.findUnique({ where: { entityId } });
}

export async function upsertFederationMetadata(
  entityId: string,
  type: string,
  xml?: string,
  json?: string
) {
  return prisma.federationMetadata.upsert({
    where: { entityId },
    create: { entityId, type, xml, json },
    update: { type, xml, json },
  });
}

export async function createUniversity(data: {
  name: string;
  entityId: string;
  metadataUrl?: string;
}) {
  return prisma.university.create({ data });
}

export async function getVerifiedStudentCount() {
  return prisma.user.count({ where: { isVerified: true } });
}

export async function assignUserToUniversityGroups(
  userId: string,
  universityId: string,
  affiliation: string
) {
  const groups = await prisma.universityGroup.findMany({
    where: { universityId },
    select: { id: true },
  });
  await prisma.userUniversityGroup.createMany({
    data: groups.map((g) => ({ userId, groupId: g.id })),
    skipDuplicates: true,
  });
}
