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
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.engagementLike.findUnique({
      where: { userId_postId: { userId: data.userId, postId: data.postId } },
    });
    if (existing) {
      return NextResponse.json({ ok: true, btrEarned: 0, message: "Already liked" });
    }

    // Education/maths posts earn more BTR
    const btrEarned = data.category === "education" || data.category === "maths" ? 5 : 2;

    await prisma.$transaction([
      prisma.engagementLike.create({
        data: { userId: data.userId, postId: data.postId, btrEarned },
      }),
      prisma.rewardEntry.create({
        data: {
          userId: data.userId,
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
