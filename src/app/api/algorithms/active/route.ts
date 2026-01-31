import { NextRequest, NextResponse } from "next/server";
import { getActiveAlgorithmForUser } from "@/lib/services/algorithms";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  try {
    const algorithm = await getActiveAlgorithmForUser(userId);
    return NextResponse.json({ algorithmId: algorithm?.id ?? null, algorithm: algorithm ?? null });
  } catch {
    return NextResponse.json({ algorithmId: null, algorithm: null });
  }
}
