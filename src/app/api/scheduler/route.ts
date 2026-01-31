import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getScheduleBlocks, createScheduleBlock } from "@/lib/services/scheduler";

const createSchema = z.object({
  userId: z.string().min(1),
  algorithmId: z.string().min(1),
  dayOfWeek: z.number().min(0).max(6),
  startHour: z.number().min(0).max(23),
  endHour: z.number().min(0).max(24),
  label: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  try {
    const blocks = await getScheduleBlocks(userId);
    return NextResponse.json(blocks);
  } catch (e) {
    return NextResponse.json({ error: "Failed to get schedule" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const block = await createScheduleBlock(data);
    return NextResponse.json(block);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create schedule block" }, { status: 500 });
  }
}
