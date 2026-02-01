import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Reset the student account for testing: clear all BTR (reward ledger) and
 * engagement likes so you can like posts again and earn BTR.
 * Uses the same "demo" user as the app (first verified user, or first user).
 */
async function resolveUserId(userId: string | null): Promise<string | null> {
  if (!userId || userId === "demo") {
    const user = await prisma.user.findFirst({
      where: { isVerified: true },
      select: { id: true },
    });
    const fallback = await prisma.user.findFirst({ select: { id: true } });
    return (user ?? fallback)?.id ?? null;
  }
  return userId;
}

export async function POST(req: NextRequest) {
  try {
    const userIdParam = req.nextUrl.searchParams.get("userId");
    let userId: string | null = userIdParam;

    if (!userId) {
      try {
        const body = await req.json().catch(() => ({}));
        userId = (body as { userId?: string }).userId ?? null;
      } catch {
        // no body
      }
    }

    userId = await resolveUserId(userId);

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
