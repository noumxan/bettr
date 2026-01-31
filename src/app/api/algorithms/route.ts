import { NextResponse } from "next/server";
import { z } from "zod";
import { listAlgorithms, createAlgorithm } from "@/lib/services/algorithms";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  intent: z.enum(["study", "news", "social", "wellness", "discovery"]),
  popularity: z.number().min(0).max(100).optional(),
  trustScore: z.number().min(0).max(100).optional(),
  ipfsCid: z.string().optional(),
  solanaMint: z.string().optional(),
});

export async function GET() {
  try {
    const list = await listAlgorithms();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: "Failed to list algorithms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const alg = await createAlgorithm(data);
    return NextResponse.json(alg);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create algorithm" }, { status: 500 });
  }
}
