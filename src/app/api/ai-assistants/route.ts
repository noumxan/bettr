import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const list = await prisma.aIAssistant.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: "Failed to list AI assistants" }, { status: 500 });
  }
}
