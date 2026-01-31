import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateScheduleBlock } from "@/lib/services/scheduler";

const patchSchema = z.object({
  algorithmId: z.string().min(1).optional(),
  label: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ blockId: string }> }
) {
  const { blockId } = await params;
  if (!blockId) {
    return NextResponse.json({ error: "blockId required" }, { status: 400 });
  }
  try {
    const body = await req.json();
    const data = patchSchema.parse(body);
    const block = await updateScheduleBlock(blockId, data);
    return NextResponse.json(block);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update block" }, { status: 500 });
  }
}
