# Enable real university SSO (Jisc / OpenAthens)

This guide explains how to turn on **real** university sign-in so users can log in with their institution (SAML 2.0 / Shibboleth / OpenAthens).

---

## 1. What you need from your university / IdP

Your institution (or Jisc/OpenAthens) will need to give you:

| Item | Description | Example |
|------|-------------|--------|
| **IdP SSO URL** | Where users are sent to sign in | `https://idp.university.ac.uk/shibboleth-idp/SSO` |
| **IdP entity ID** | Identifier of the IdP | `https://idp.university.ac.uk/idp/shibboleth` |
| **IdP metadata URL** (optional) | URL to download IdP metadata | `https://idp.university.ac.uk/idp/shibboleth/metadata` |
| **Attributes** | Which attributes they release | Usually `eduPersonPrincipalName`, `eduPersonAffiliation`, optionally `mail`, `displayName` |

They will also ask you for **your** (Service Provider) details:

- **SP entity ID** — e.g. `https://your-bettr-domain.com/saml/metadata`
- **ACS URL** (Assertion Consumer Service) — e.g. `https://your-bettr-domain.com/api/auth/jisc/callback`
- **SP metadata** — you can give them the XML from the URL in step 2 below.

---

## 2. Get your Bettr SP metadata

Your app exposes SAML SP metadata at:

```
https://YOUR-DOMAIN/api/auth/jisc?action=metadata
```

For local dev:

```
http://localhost:3000/api/auth/jisc?action=metadata
```

- Open that URL in a browser (or `curl`) and **save the XML** (or send the URL to your IdP admin).
- Send this metadata (or URL) to your university / Jisc so they can register your app as a Service Provider.

---

## 3. Configure environment variables

In your project root, edit `.env` (copy from `.env.example` if needed) and set:

```env
# Your app’s public URL (required for callback)
NEXT_PUBLIC_APP_URL="https://your-bettr-domain.com"
# For local testing with a tunnel (e.g. ngrok):
# NEXT_PUBLIC_APP_URL="https://abc123.ngrok.io"

# Your SAML entity ID (must match what you register with the IdP)
JISC_ENTITY_ID="https://your-bettr-domain.com/saml/metadata"

# IdP single sign-on URL — from your university / Jisc
JISC_SSO_URL="https://idp.university.ac.uk/shibboleth-idp/SSO"
```

**OpenAthens** (instead of a university Shibboleth):

```env
OPENATHENS_SSO_URL="https://openathens.org/..."
# JISC_ENTITY_ID and NEXT_PUBLIC_APP_URL as above
```

Restart the app after changing `.env`:

```bash
npm run dev
```

---

## 4. Register your app with the IdP

1. Send your **SP metadata** (from step 2) to your university IT / Jisc contact.
2. Tell them your **ACS URL**:
   - Production: `https://your-bettr-domain.com/api/auth/jisc/callback`
   - Local (with tunnel): `https://your-ngrok-url.ngrok.io/api/auth/jisc/callback`
3. Ask them to:
   - Register your entity ID and ACS URL.
   - Release at least:
     - **eduPersonPrincipalName** (e.g. `user@university.ac.uk`)
     - **eduPersonAffiliation** (e.g. `student`, `staff`, `member`)
   - Optionally: `mail`, `displayName`.
4. They may give you an **IdP metadata URL** — you can use it later for signature validation if you add a SAML library.

---

## 5. Test the flow

1. Go to your login page: `https://your-domain/login`
2. Click **“Sign in with university (Jisc/OpenAthens)”**.
3. You should be redirected to the **university login page**.
4. After signing in, the IdP posts a SAML response to your **callback** (`/api/auth/jisc/callback`).
5. The app creates or updates a user from **eduPersonPrincipalName** and **eduPersonAffiliation** and marks them verified, then redirects to the app.

**Local testing:**  
IdPs usually require HTTPS and a public URL. Use a tunnel (e.g. [ngrok](https://ngrok.com)):

```bash
ngrok http 3000
```

Then set `NEXT_PUBLIC_APP_URL` to the `https://...ngrok.io` URL and use that base URL when registering the SP with the IdP.

---

## 6. Callback behaviour (what the app does)

- **POST /api/auth/jisc/callback**  
  Receives the SAML response from the IdP (form field `SAMLResponse`).  
  The app decodes it and uses the attributes to create/update a user and redirect back into the app.  
  For full production use, you would add a SAML library (e.g. `passport-saml`, `saml2-js`) to validate signatures and parse attributes reliably.

- **Attributes used**
  - **eduPersonPrincipalName** → user identifier (and email if no `mail`)
  - **eduPersonAffiliation** → stored on the user (e.g. student / staff)
  - User is set **verified** when they sign in via SSO.

---

## 7. Troubleshooting

| Issue | What to check |
|-------|----------------|
| “University sign-in is not set up” | `JISC_SSO_URL` or `OPENATHENS_SSO_URL` is not set in `.env`. Restart the app. |
| Redirect to IdP fails / wrong URL | Confirm `JISC_SSO_URL` (or `OPENATHENS_SSO_URL`) and `JISC_ENTITY_ID` match what the IdP expects. |
| IdP says “Unknown service” | IdP has not registered your SP. Send them your SP metadata and ACS URL (step 2 & 4). |
| Callback returns 501 / “SAML parsing not implemented” | Real SAML parsing is not fully implemented yet. For production, integrate a SAML library and parse `SAMLResponse` in the callback. |
| Callback URL not reached | IdP must POST to `NEXT_PUBLIC_APP_URL/api/auth/jisc/callback`. Check firewall, HTTPS, and that `NEXT_PUBLIC_APP_URL` is correct. |

---

## 8. Optional: full SAML parsing in the callback

For production you should:

1. Add a SAML library, e.g. `passport-saml` or `saml2-js`.
2. In **POST /api/auth/jisc/callback**:
   - Decode and parse `SAMLResponse`.
   - Validate signature (IdP certificate / metadata).
   - Read **NameID** or **AttributeStatement** (eduPersonPrincipalName, eduPersonAffiliation, mail, displayName).
   - Create/update user and set a session cookie (or redirect with a token), then redirect to `/` or `/admin` as needed.

The database already has `User.eduPersonPrincipalName`, `User.eduPersonAffiliation`, and `FederationMetadata` for IdP metadata; the callback is the place to wire these to the SAML response once parsing is in place.
