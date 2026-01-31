import { NextResponse } from "next/server";
import { z } from "zod";
import { toggleUserAlgorithm } from "@/lib/services/algorithms";

const bodySchema = z.object({
  userId: z.string().min(1),
  algorithmId: z.string().min(1),
  active: z.boolean(),
});

/**
 * Set a user's active algorithm (only one active at a time).
 * When active is true, other toggles for this user are set to false.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, algorithmId, active } = bodySchema.parse(body);
    const { prisma } = await import("@/lib/db");
    if (active) {
      await prisma.userAlgorithmToggle.updateMany({
        where: { userId },
        data: { active: false },
      });
    }
    await toggleUserAlgorithm(userId, algorithmId, active);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to toggle algorithm" }, { status: 500 });
  }
}
