import { NextRequest, NextResponse } from "next/server";

/**
 * Jisc / OpenAthens SSO integration.
 * Bounty 1: Global Student Onboarding.
 *
 * Technical integrations: SAML 2.0, Shibboleth, OIDC, OpenAthens Keystone, eduPerson Attributes.
 *
 * Flow:
 * 1. SP-initiated: redirect to IdP login
 * 2. IdP authenticates, returns SAML Assertion / OIDC tokens
 * 3. We validate and extract eduPersonPrincipalName, eduPersonAffiliation
 * 4. Create/link user, set isVerified
 *
 * Configure in .env:
 * - JISC_ENTITY_ID
 * - JISC_SSO_URL (IdP SSO endpoint)
 * - JISC_METADATA_URL
 * - OPENATHENS_DISCOVERY_URL (for OIDC)
 */
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");

  if (action === "metadata") {
    // SP metadata for Shibboleth — return our entity descriptor
    const entityId = process.env.JISC_ENTITY_ID ?? "https://bettr.app/saml/metadata";
    const acsUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/jisc/callback`
      : "http://localhost:3000/api/auth/jisc/callback";

    const metadata = `<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${entityId}">
  <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${acsUrl}" index="0"/>
  </SPSSODescriptor>
</EntityDescriptor>`;

    return new NextResponse(metadata, {
      headers: { "Content-Type": "application/samlmetadata+xml" },
    });
  }

  if (action === "login") {
    // Redirect to IdP — in production, build SAML AuthnRequest
    const ssoUrl = process.env.JISC_SSO_URL ?? process.env.OPENATHENS_SSO_URL;
    if (!ssoUrl) {
      // Not configured: send user back to login with a hint to use email
      const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      return NextResponse.redirect(`${base}/login?jisc=unconfigured`);
    }
    const redirectUrl = new URL(ssoUrl);
    redirectUrl.searchParams.set("entityID", process.env.JISC_ENTITY_ID ?? "https://bettr.app");
    return NextResponse.redirect(redirectUrl.toString());
  }

  return NextResponse.json({
    message: "Jisc/OpenAthens integration",
    actions: ["?action=metadata", "?action=login"],
    docs: "https://www.jisc.ac.uk/",
  });
}
