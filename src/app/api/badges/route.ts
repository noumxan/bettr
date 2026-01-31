import { NextRequest, NextResponse } from "next/server";
import { listBadges, getUserBadges } from "@/lib/services/badges";

/**
 * GET /api/badges — list all badges (Curriculum of Content / Open Badges v3).
 * GET /api/badges?userId=xxx — list badges earned by user (for Digital Asset Hub).
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  try {
    if (userId) {
      const userBadges = await getUserBadges(userId);
      return NextResponse.json(userBadges);
    }
    const list = await listBadges();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: "Failed to list badges" }, { status: 500 });
  }
}
