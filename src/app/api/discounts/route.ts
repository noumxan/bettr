import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Student discounts — redeem Bettr Tokens (BTR) for partner offers.
 * Bounty 4: Privacy-First Monetization.
 */
export async function GET() {
  try {
    const discounts = await prisma.studentDiscount.findMany({
      orderBy: { btrCost: "asc" },
    });
    return NextResponse.json(discounts);
  } catch (e) {
    return NextResponse.json({ error: "Failed to list discounts" }, { status: 500 });
  }
}
