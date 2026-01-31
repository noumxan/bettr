import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Jisc/OpenAthens SAML Assertion Consumer Service (ACS).
 * Receives SAML response from IdP, extracts eduPerson attributes, creates/updates user.
 *
 * In production: validate SAML signature, parse assertion, extract:
 * - eduPersonPrincipalName
 * - eduPersonAffiliation (student | staff | faculty)
 * - displayName, email
 */
export async function POST(req: NextRequest) {
  try {
    // In production, parse SAML response from form body
    const formData = await req.formData().catch(() => null);
    const samlResponse = formData?.get("SAMLResponse") as string | null;

    if (!samlResponse) {
      // Demo: allow test callback with query params
      const principal = req.nextUrl.searchParams.get("eduPersonPrincipalName") ?? "student@example.edu";
      const affiliation = req.nextUrl.searchParams.get("eduPersonAffiliation") ?? "student";

      const user = await prisma.user.upsert({
        where: { eduPersonPrincipalName: principal },
        create: {
          eduPersonPrincipalName: principal,
          eduPersonAffiliation: affiliation,
          email: principal,
          displayName: principal.split("@")[0],
          isVerified: true,
        },
        update: { isVerified: true, eduPersonAffiliation: affiliation },
      });

      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      return NextResponse.redirect(`${redirectUrl}/?jisc=1&userId=${user.id}`);
    }

    // TODO: Parse real SAML, validate, extract attributes
    return NextResponse.json({ error: "SAML parsing not implemented" }, { status: 501 });
  } catch (e) {
    return NextResponse.json({ error: "Callback failed" }, { status: 500 });
  }
}
