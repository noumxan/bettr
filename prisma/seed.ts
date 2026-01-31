import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Bounty 1: University + federation metadata
  const uni = await prisma.university.upsert({
    where: { entityId: "https://example.edu/shibboleth" },
    create: {
      name: "Example University",
      entityId: "https://example.edu/shibboleth",
      metadataUrl: "https://example.edu/metadata.xml",
    },
    update: {},
  });

  const existingGroup = await prisma.universityGroup.findFirst({
    where: { universityId: uni.id, name: "Faculty of Science" },
  });
  if (!existingGroup) {
    await prisma.universityGroup.create({
      data: {
        universityId: uni.id,
        name: "Faculty of Science",
        externalId: "science",
      },
    });
  }

  await prisma.federationMetadata.upsert({
    where: { entityId: uni.entityId },
    create: { entityId: uni.entityId, type: "IdP", json: "{}" },
    update: {},
  });

  const user = await prisma.user.upsert({
    where: { email: "student@example.edu" },
    create: {
      email: "student@example.edu",
      eduPersonPrincipalName: "student@example.edu",
      eduPersonAffiliation: "student",
      displayName: "Demo Student",
      universityId: uni.id,
      isVerified: true,
    },
    update: {},
  });

  // Bounty 2: Decentralized Algorithm Marketplace (Vocational Upskilling, Social Discovery, Global News, Peer Highlights)
  let algVocational = await prisma.algorithm.findFirst({ where: { name: "Vocational Upskilling" } });
  if (!algVocational) {
    algVocational = await prisma.algorithm.create({
      data: {
        name: "Vocational Upskilling",
        description: "Academic content and career-focused learning. Fights doomscrolling with structured curriculum.",
        intent: "study",
        popularity: 92,
        trustScore: 88,
        ipfsCid: "QmExample",
        solanaMint: null,
      },
    });
  }

  let algSocial = await prisma.algorithm.findFirst({ where: { name: "Social Discovery" } });
  if (!algSocial) {
    algSocial = await prisma.algorithm.create({
      data: {
        name: "Social Discovery",
        description: "Relaxed, diverse perspectives. For evening and social time.",
        intent: "social",
        popularity: 78,
        trustScore: 82,
      },
    });
  }

  let algNews = await prisma.algorithm.findFirst({ where: { name: "Global News" } });
  if (!algNews) {
    algNews = await prisma.algorithm.create({
      data: {
        name: "Global News",
        description: "Stay informed with curated news feed.",
        intent: "news",
        popularity: 75,
        trustScore: 85,
      },
    });
  }

  let algPeer = await prisma.algorithm.findFirst({ where: { name: "Peer Highlights" } });
  if (!algPeer) {
    algPeer = await prisma.algorithm.create({
      data: {
        name: "Peer Highlights",
        description: "Highlights from your peers and campus.",
        intent: "social",
        popularity: 80,
        trustScore: 80,
      },
    });
  }

  await prisma.userAlgorithmToggle.upsert({
    where: { userId_algorithmId: { userId: user.id, algorithmId: algVocational.id } },
    create: { userId: user.id, algorithmId: algVocational.id, active: true },
    update: { active: true },
  });

  // Bounty 3: Algorithmic Productivity Scheduler — Content Curriculum (Vocational mornings, Social evening)
  const existingBlock = await prisma.scheduleBlock.findFirst({ where: { userId: user.id } });
  if (!existingBlock) {
    await prisma.scheduleBlock.create({
      data: {
        userId: user.id,
        algorithmId: algVocational.id,
        dayOfWeek: 1,
        startHour: 9,
        endHour: 12,
        label: "Vocational Upskilling (weekday morning)",
      },
    });
    await prisma.scheduleBlock.create({
      data: {
        userId: user.id,
        algorithmId: algSocial.id,
        dayOfWeek: 1,
        startHour: 18,
        endHour: 22,
        label: "Social Discovery (evening)",
      },
    });
  }

  // Bounty 4: Rewards
  const rewardCount = await prisma.rewardEntry.count({ where: { userId: user.id } });
  if (rewardCount === 0) {
    await prisma.rewardEntry.create({
      data: { userId: user.id, reason: "Completed focus block", points: 50 },
    });
  }

  // Bounty 5: Badges
  let badge = await prisma.badge.findFirst({ where: { name: "Academic Progression" } });
  if (!badge) {
    badge = await prisma.badge.create({
      data: {
        name: "Academic Progression",
        description: "Completed academic track",
        focusArea: "academic",
        escoSkillId: "ESCO:academic",
      },
    });
  }
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
    create: { userId: user.id, badgeId: badge.id },
    update: {},
  }).catch(() => {});

  // Bounty 6: AI Assistant & Digital Asset Hub (Academic Mentor, nutrition, exam prep, creator fashion)
  if ((await prisma.aIAssistant.count()) === 0) {
    await prisma.aIAssistant.createMany({
      data: [
        { name: "Academic Mentor", description: "Understands your university timetable. Study tips and resources (LangGraph/CrewAI).", skillFocus: "academic", pricing: "Free" },
        { name: "Exam Prep Coach", description: "Specialized for exam prep and revision planning.", skillFocus: "academic", pricing: "Free" },
        { name: "Nutrition Mentor", description: "Wellness and nutrition guidance for students.", skillFocus: "nutrition", pricing: "Free" },
        { name: "Career Advisor", description: "Vocational upskilling and career pathways.", skillFocus: "career", pricing: "Free" },
      ],
    });
  }
  if ((await prisma.digitalAsset.count()) === 0) {
    await prisma.digitalAsset.createMany({
      data: [
        { name: "Creator Skin: Midnight", type: "skin", metaplexUri: "https://arweave.net/example", spl404Mint: null },
        { name: "Creator Fashion: Campus Blue", type: "fashion", metaplexUri: "https://arweave.net/example2", spl404Mint: null },
      ],
    });
  }

  // Courses
  if ((await prisma.course.count()) === 0) {
    const course = await prisma.course.create({
      data: {
        title: "Introduction to Algorithms",
        description: "Moodle-like course.",
        universityId: uni.id,
        type: "academic",
      },
    });
    await prisma.courseTopic.create({
      data: { courseId: course.id, title: "Sorting", order: 0, algorithmId: algVocational.id },
    });
    await prisma.course.create({
      data: {
        title: "Spanish 101",
        description: "Duolingo-style language course.",
        type: "language",
      },
    });
  }

  // Workspace
  if ((await prisma.workspace.count()) === 0) {
    const workspace = await prisma.workspace.create({
      data: { name: "Science Faculty Workspace", universityId: uni.id },
    });
    await prisma.workspaceMember.create({
      data: { userId: user.id, workspaceId: workspace.id, role: "member" },
    });
  }

  // Student discounts (Bettr Tokens) — Digital Asset Hub: Campus Café, Student Beans, UNiDAYS, Campus Books, StudyPro
  if ((await prisma.studentDiscount.count()) === 0) {
    await prisma.studentDiscount.createMany({
      data: [
        { name: "Campus café 2-for-1", description: "Coffee & snacks", btrCost: 25, partnerName: "Campus Café", category: "food" },
        { name: "10% off Student Beans", description: "Tech & lifestyle", btrCost: 50, partnerName: "Student Beans", category: "tech" },
        { name: "UNiDAYS 15% off", description: "Fashion & brands", btrCost: 75, partnerName: "UNiDAYS", category: "tech" },
        { name: "Maths textbook voucher", description: "£5 off academic books", btrCost: 100, partnerName: "Campus Books", category: "books" },
        { name: "Study app premium", description: "1 month free", btrCost: 150, partnerName: "StudyPro", category: "tech" },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
