import { NextResponse } from "next/server";
import { z } from "zod";
import { getUniversities, createUniversity } from "@/lib/services/identity";

const createSchema = z.object({
  name: z.string().min(1),
  entityId: z.string().min(1),
  metadataUrl: z.string().url().optional(),
});

export async function GET() {
  try {
    const list = await getUniversities();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: "Failed to list universities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const uni = await createUniversity(data);
    return NextResponse.json(uni);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create university" }, { status: 500 });
  }
}
