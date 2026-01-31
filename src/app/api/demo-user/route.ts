import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Returns the demo / current user for the student app (first verified user, or first user).
 * Used by the main app interface for algorithms, verification, rewards, schedule.
 */
export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { isVerified: true },
      include: { university: { select: { name: true } } },
    });
    const fallback = await prisma.user.findFirst({
      include: { university: { select: { name: true } } },
    });
    const target = user ?? fallback;
    if (!target) {
      return NextResponse.json(
        { id: "demo", displayName: "Demo Student", email: "student@example.edu", isVerified: false },
        { status: 200 }
      );
    }
    return NextResponse.json({
      id: target.id,
      displayName: target.displayName ?? target.email ?? "Student",
      email: target.email,
      isVerified: target.isVerified,
      university: target.university?.name,
    });
  } catch {
    return NextResponse.json(
      { id: "demo", displayName: "Demo Student", email: "student@example.edu", isVerified: false },
      { status: 200 }
    );
  }
}
