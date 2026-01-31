"use client";

import { useBettr } from "@/context/BettrContext";

export default function VerifyPage() {
  const { isVerified } = useBettr();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-bettr-forest">Verified Identity & Brand Safety</h1>
        <p className="mt-1 text-bettr-navy/70">
          University discovery (WAYF-style), verification process explanation, and account status. No real SSO in MVP.
        </p>
      </div>

      <div className="rounded-xl border border-bettr-sage/30 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-bettr-forest">Account status</h2>
        <div className="mt-4 flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              isVerified ? "bg-bettr-mint text-bettr-forest" : "bg-bettr-coral/50 text-bettr-navy"
            }`}
          >
            {isVerified ? "✓" : "?"}
          </div>
          <div>
            <p className="font-medium text-bettr-navy">
              {isVerified ? "Verified student" : "Not verified"}
            </p>
            <p className="text-sm text-bettr-navy/70">
              {isVerified
                ? "Your account is linked to an institutional identity (simulated)."
                : "Connect via your institution to get verified."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-bettr-sage/30 bg-bettr-cream/50 p-6">
        <h2 className="text-lg font-semibold text-bettr-forest">University discovery (WAYF-style)</h2>
        <p className="mt-2 text-sm text-bettr-navy/80">
          In production, you would select your institution from a list (e.g. Jisc / OpenAthens). Shibboleth IdP attributes (eduPersonPrincipalName, eduPersonAffiliation) would be used. OpenAthens Keystone (OIDC ↔ SAML bridge) would enable integration. No sensitive PII collected in MVP.
        </p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-bettr-navy">Select your institution (mock)</label>
          <select className="mt-2 w-full max-w-md rounded-lg border border-bettr-sage bg-white px-3 py-2 text-bettr-navy">
            <option>— Choose institution —</option>
            <option>Example University (demo)</option>
            <option>Another College (demo)</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-bettr-sage/30 bg-white/80 p-6 text-sm text-bettr-navy/80">
        <p>
          <strong>Conceptual integration:</strong> Jisc / OpenAthens, OpenAthens Keystone (OIDC ↔ SAML bridge), Shibboleth IdP attributes, GDPR-compliant pseudonymous identifiers. Architecture is integration-ready; no real SSO required in MVP.
        </p>
      </div>
    </div>
  );
}
