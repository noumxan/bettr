import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  userId: z.string().min(1),
  postId: z.string().min(1),
  category: z.enum(["education", "maths", "social", "news"]).optional(),
});

/**
 * Like a post → earn Bettr Tokens (BTR).
 * Education/maths posts award more BTR to incentivize learning.
 * Bounty 4 + 5: Monetization + Curriculum.
 */
async function resolveUserId(userId: string): Promise<string | null> {
  if (userId !== "demo") return userId;
  const user = await prisma.user.findFirst({ where: { isVerified: true }, select: { id: true } });
  const fallback = await prisma.user.findFirst({ select: { id: true } });
  return (user ?? fallback)?.id ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const userId = await resolveUserId(data.userId);
    if (!userId) {
      return NextResponse.json(
        { error: "No user found. Use the app after signing in or run seed." },
        { status: 400 }
      );
    }

    const existing = await prisma.engagementLike.findUnique({
      where: { userId_postId: { userId, postId: data.postId } },
    });
    if (existing) {
      return NextResponse.json({ ok: true, btrEarned: 0, message: "Already liked" });
    }

    // Education/maths posts earn more BTR
    const btrEarned = data.category === "education" || data.category === "maths" ? 5 : 2;

    await prisma.$transaction([
      prisma.engagementLike.create({
        data: { userId, postId: data.postId, btrEarned },
      }),
      prisma.rewardEntry.create({
        data: {
          userId,
          reason: `Liked ${data.category ?? "social"} post`,
          points: btrEarned,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, btrEarned });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to record like" }, { status: 500 });
  }
}
