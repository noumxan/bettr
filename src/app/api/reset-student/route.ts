import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Reset the student account for testing: clear all BTR (reward ledger) and
 * engagement likes so you can like posts again and earn BTR.
 * Uses the same "demo" user as the app (first verified user, or first user).
 */
export async function POST(req: NextRequest) {
  try {
    const userIdParam = req.nextUrl.searchParams.get("userId");
    let userId: string | null = null;

    if (userIdParam) {
      userId = userIdParam;
    } else {
      const user = await prisma.user.findFirst({
        where: { isVerified: true },
        select: { id: true },
      });
      const fallback = await prisma.user.findFirst({ select: { id: true } });
      userId = (user ?? fallback)?.id ?? null;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "No user found. Run seed first (npm run setup)." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.rewardEntry.deleteMany({ where: { userId } }),
      prisma.engagementLike.deleteMany({ where: { userId } }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Student account reset. BTR balance and likes cleared — you can like pics again to earn BTR.",
      userId,
    });
  } catch (e) {
    console.error("reset-student", e);
    return NextResponse.json(
      { error: "Failed to reset student account." },
      { status: 500 }
    );
  }
}
