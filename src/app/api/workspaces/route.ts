import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const list = await prisma.workspace.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { members: true } } },
    });
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: "Failed to list workspaces" }, { status: 500 });
  }
}
