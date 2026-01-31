import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  universityId: z.string().optional(),
  type: z.enum(["academic", "language"]).optional(),
});

export async function GET() {
  try {
    const list = await prisma.course.findMany({
      orderBy: { title: "asc" },
      include: { _count: { select: { enrollments: true, topics: true } } },
    });
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: "Failed to list courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const course = await prisma.course.create({
      data: { ...data, type: data.type ?? "academic" },
    });
    return NextResponse.json(course);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
