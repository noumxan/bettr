import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRewardHistory, getRewardBalance, addReward } from "@/lib/services/rewards";

const addSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().min(1),
  points: z.number().int().min(0),
  txSignature: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  try {
    const [history, balance] = await Promise.all([
      getRewardHistory(userId),
      getRewardBalance(userId),
    ]);
    return NextResponse.json({ history, balance });
  } catch (e) {
    return NextResponse.json({ error: "Failed to get rewards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = addSchema.parse(body);
    const entry = await addReward(data.userId, data.reason, data.points, data.txSignature);
    return NextResponse.json(entry);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add reward" }, { status: 500 });
  }
}
