# Bettr — Technical Integrations

This document describes the technical integrations implemented for the bounty objectives.

---

## Bounty 1: Global Student Onboarding (Jisc/OpenAthens)

**Value:** Integration with Jisc/OpenAthens SSO for mass student verification and automated account creation.

**Technical integrations:** SAML 2.0, Shibboleth, OIDC, OpenAthens Keystone, eduPerson Attributes.

### Implemented

- **`/api/auth/jisc`** — SP metadata (`?action=metadata`) and login redirect (`?action=login`)
- **`/api/auth/jisc/callback`** — SAML Assertion Consumer Service (ACS); accepts eduPersonPrincipalName, eduPersonAffiliation
- **Database:** `University`, `UniversityGroup`, `FederationMetadata`, `User.eduPersonPrincipalName`, `User.eduPersonAffiliation`

### Configuration (.env)

```env
JISC_ENTITY_ID=https://bettr.app/saml/metadata
JISC_SSO_URL=https://your-idp.example.edu/sso
OPENATHENS_SSO_URL=https://openathens.org/...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Bounty 2: Decentralized Algorithm Marketplace

**Technical integrations:** AT Protocol (Bluesky), getFeedSkeleton API, IPFS/Arweave, Solana Metadata.

### Implemented

- **`/api/feed/skeleton`** — AT Protocol–style `getFeedSkeleton`; returns ordered feed item IDs by algorithm intent
- **Database:** `Algorithm.ipfsCid`, `Algorithm.solanaMint` for on-chain metadata pointers

---

## Bounty 3: Wellness & Productivity Scheduler

**Technical integrations:** React Calendar, Cron-based triggers, API Webhooks.

### Implemented

- **`/api/scheduler`** — GET/POST schedule blocks; `getUsersDueForAlgorithmSwitch(dayOfWeek, hour)` for cron
- **Client:** Focus blocks auto-switch algorithm when current time falls within a scheduled block

---

## Bounty 4: Privacy-First Monetization (Bettr Tokens)

**Technical integrations:** Solana Pay, SPL Token 2022, Transfer Hooks, Zero-Knowledge Proofs.

### Implemented

- **Bettr Tokens (BTR)** — In-app currency with logo; earned via engagement (like education posts)
- **`/api/rewards`** — Balance, history; `RewardEntry.txSignature` for Solana Pay
- **`/api/engagement/like`** — Like post → earn BTR (5 for education/maths, 2 for social)
- **`/api/discounts`** — Student discounts redeemable with BTR (UNiDAYS, Student Beans, etc.)

---

## Bounty 5: Curriculum of Content & Skills Hub

**Technical integrations:** Open Badges v3, W3C Verifiable Credentials, FORGE, ESCO Database.

### Implemented

- **Database:** `Badge.openBadgesJson`, `Badge.escoSkillId`
- **Study Mode** — Education/maths content prioritized when Study Mode algorithm is active
- **Engagement rewards** — Like education posts → BTR → student discounts

---

## Bounty 6: AI Assistant & Digital Ownership Hub

**Technical integrations:** LangGraph/CrewAI, Solana SPL, MPL Core.

### Implemented

- **Database:** `AIAssistant`, `DigitalAsset` with `metaplexUri`, `spl404Mint`
- **`/api/ai-assistants`**, **`/api/digital-assets`** — List endpoints

---

## Run setup

After pulling changes, run:

```bash
npm run setup
```

This applies the new schema (StudentDiscount, EngagementLike) and seeds student discounts.
