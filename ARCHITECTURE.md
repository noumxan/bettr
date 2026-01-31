# Bettr — System Architecture (Backend + 6 Bounties)

## Overview

- **Student-facing app** (unchanged): Feed, Algorithm marketplace, Scheduler, Curriculum, Rewards, Verify, AI & Assets. Can consume data from APIs.
- **Backend dashboard** (`/dashboard`): Bounties nav with subpages, metric cards per bounty, tables backed by DB and APIs.

## Bounty pillars (backend + APIs)

| Bounty | Module | DB models | API routes |
|--------|--------|-----------|------------|
| 1 | Student Identity / University Federation | University, FederationMetadata, User (eduPerson*), UniversityGroup | GET/POST /api/universities |
| 2 | Decentralized Algorithm Marketplace | Algorithm (ipfsCid, solanaMint), UserAlgorithmToggle | GET/POST /api/algorithms, GET /api/feed/skeleton?userId= |
| 3 | Wellness & Productivity Scheduler | ScheduleBlock | GET/POST /api/scheduler |
| 4 | Privacy-First Monetization | RewardEntry, Payout | GET/POST /api/rewards |
| 5 | Curriculum / Badges | Badge, UserBadge | GET /api/badges |
| 6 | AI Assistant & Digital Assets | AIAssistant, DigitalAsset | GET /api/ai-assistants, GET /api/digital-assets |

Extra: Courses (Course, CourseTopic, CourseEnrollment), Workspaces (Workspace, WorkspaceMember). APIs: GET/POST /api/courses, GET /api/workspaces.

## Services (`src/lib/services/`)

- **identity** — Universities, federation metadata, verified-student counts.
- **algorithms** — List/create algorithms, toggle per user, get active algorithm.
- **feed** — getFeedSkeleton(userId) (AT Protocol style).
- **scheduler** — Schedule blocks CRUD, getUsersDueForAlgorithmSwitch(day, hour) for cron.
- **rewards** — Add reward, history, balance, payout total.
- **badges** — List badges, issue badge, user badges, leaderboard.

## Setup

```bash
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma generate
npx prisma db push
npx prisma db seed
```

Student app and dashboard consume the same Prisma DB and API routes. No existing features removed—all extended.
