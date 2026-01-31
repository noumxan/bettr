import { NextRequest, NextResponse } from "next/server";
import { getFeedSkeleton } from "@/lib/services/feed";

/**
 * AT Protocol–style getFeedSkeleton.
 * Query: ?userId=xxx&limit=50
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 50, 100);
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  try {
    const skeleton = await getFeedSkeleton(userId, limit);
    return NextResponse.json(skeleton);
  } catch (e) {
    return NextResponse.json({ error: "Failed to get feed skeleton" }, { status: 500 });
  }
}
