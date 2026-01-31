# Bettr — Full Explanation for Non-Technical Staff

This document explains **what Bettr is**, **how it differs from normal social media**, and **what every part of the app does** — in plain language, with enough technical detail for staff who need to understand or present the product.

---

## Part 1: What Bettr Is and How It’s Different from Normal Social Media

### What is Bettr?

Bettr is a **student-focused social and learning app** that looks like a feed (similar to Instagram or TikTok) but is built to **reduce doomscrolling**, **reward learning**, and **put the user in control** of what their feed shows and when.

### How is it different from normal social media?

| Normal social media | Bettr |
|---------------------|--------|
| **One algorithm** decides what you see. You can’t really choose. | **You choose** which “algorithm” (feed style) is active: study-focused, social, news, or peer highlights. You can change it anytime. |
| **Infinite scroll** is designed to keep you scrolling. | **Content Curriculum** lets you **schedule** when your feed is “study mode” (e.g. mornings) and when it’s “social mode” (e.g. evenings). The app switches automatically. |
| **Likes** don’t give you anything except a number. | **Likes earn Bettr Tokens (BTR)**. Liking education/maths posts earns more BTR. You **spend BTR** on real student discounts (Campus Café, UNiDAYS, books, etc.). |
| **No link to your university** or timetable. | You can **sign in with your university** (Jisc/OpenAthens) so your account is verified. The app can show courses, assignments, and AI mentors that understand your timetable. |
| **No built-in wellness** (breathing, healthy routine by time). | **Wellness** tab: breathing exercises, healthy lifestyle by time of day (exercise morning, diet afternoon, walking evening, relaxation night), quotes, reading, library search, community groups. |
| **Ads** are chosen by the platform. | You can **choose ad themes** (tech, fashion, books, wellness, etc.) so ads are more relevant. You can also choose **music style** for promoted content. |
| **No AI help** to navigate or study. | **AI navigation chatbot** (floating button) answers “Where do I redeem BTR?” etc. **AI assistants** in the Hub (Academic Mentor, Exam Prep, Nutrition) chat with you for study tips and problem-solving. |
| **No calendar** tied to your feed. | **Moodle-style calendar** (weekly and monthly) shows when study blocks and social blocks are scheduled, so you see your “content curriculum” at a glance. |

### What is “added” in Bettr (features normal social media don’t have)?

- **Algorithm Marketplace** — You pick which feed “mode” is active (Vocational Upskilling, Social Discovery, Global News, Peer Highlights).
- **Content Curriculum (scheduler)** — You set **when** each mode runs (e.g. study 9–12, social 18–22). The feed **auto-switches** by time. Extra presets: Normal, Standard, Exam week, Relaxed, Intensive, Balance. You can **change the algorithm per time block** (dropdown per block).
- **Bettr Tokens (BTR)** — Earned by liking posts (more for education/maths). Spent on **student discounts** in the Digital Asset Hub (Campus Café, Student Beans, UNiDAYS, Campus Books, StudyPro).
- **University sign-in (Jisc/OpenAthens)** — One-click sign-in with your institution; verified badge; no need to type a password if your uni supports it.
- **Wellness by time** — Morning exercise, afternoon diet, evening walking, night relaxation; breathing exercise; motivational quotes with authors; reading awareness; city library search; ad theme and music preferences; community groups.
- **AI navigation chatbot** — Floating chat button; asks “How do I find X?” and tells you which tab/section to go to (powered by OpenAI).
- **AI assistants in the Hub** — Click Academic Mentor, Exam Prep Coach, Nutrition Mentor, or Career Advisor to open a **chat**. They give study tips, revision advice, diet tips, career advice (powered by OpenAI, tailored to each assistant).
- **Digital Asset Hub** — BTR balance, **student discounts (redeem BTR)**, curriculum badges (Open Badges), AI assistants, creator fashion/skins (e.g. Metaplex/MPL style assets).
- **Moodle-like calendar** — Weekly grid (time × days) and monthly calendar showing when study/social blocks are; dots on days that have blocks.
- **AI “Suggest my timetable”** — In Content Curriculum, a button asks AI to suggest a weekly schedule (which algorithm when) based on your preset (e.g. Exam week).
- **DMs / Messages** — Header dropdown next to the notification bell shows sample conversations (Study Buddies, Campus Café, etc.) so the app feels like a full social inbox.
- **Reset BTR (for testing)** — On the Me tab, a “Reset BTR & likes” button clears your BTR and likes so you can test earning BTR again by liking pics.

---

## Part 2: Student Interface — Going Through the App

When a student opens Bettr (e.g. `http://localhost:3000`), they see the **main app**. Below is what each part does and how it works in simple technical terms.

### Top bar (header)

- **Bettr** logo and optional **Verified** badge (if they signed in with university).
- **Search** — Placeholder; in a full build this would search posts, people, or courses.
- **Notifications** (bell) — Placeholder for alerts.
- **Messages** (arrow icon) — Opens a **dropdown with sample DMs** (Study Buddies, Campus Café, Alex R., Book Club). Shows unread dot. Technically: mock list of conversations; in production this would load real messages from a messages API.

### Bottom navigation (tabs)

The student has **seven tabs**: Feed, Algorithms, Curriculum, Wellness, University, Hub, Me.

---

### Tab 1: Feed

**What it is:** The main scrollable feed of posts (photos/videos and text), like Instagram or TikTok.

**What’s different:**

- At the top, **Algorithm Marketplace** — The student can switch between **Vocational Upskilling**, **Social Discovery**, **Global News**, and **Peer Highlights**. Whichever is selected **changes the order and mix** of posts (e.g. Vocational Upskilling pushes education/maths content first).
- **Bettr Tokens (BTR)** and **Schedule** summary — Small cards showing current BTR balance and how many schedule blocks they have this week.
- **Stories** — Row of circles (Your story + others); same idea as Instagram stories (mock images).
- **Posts** — Each post can be **liked**. Liking **education or maths** posts gives **+5 BTR**; liking **social** posts gives **+2 BTR**. A toast appears: “+5 BTR earned!” (or +2). Once liked, the heart is filled and that post won’t pay BTR again (stored in the database so the server knows they already liked it).

**How it works technically:**

- The app calls **`/api/algorithms`** to list algorithms and **`/api/algorithms/active?userId=...`** to get the current active one.
- When the user toggles an algorithm, the app calls **`/api/algorithms/toggle`** (POST) to set the active algorithm for that user.
- When the user likes a post, the app calls **`/api/engagement/like`** (POST) with `userId`, `postId`, and `category`. The server checks if they already liked that post; if not, it creates an **EngagementLike** and a **RewardEntry** (points = 5 or 2). The response includes `btrEarned` so the app can show the toast and update the balance.
- BTR balance comes from **`/api/rewards?userId=...`** (sum of all RewardEntry points for that user).

---

### Tab 2: Algorithms (Algorithm Marketplace)

**What it is:** A screen where the student **chooses which algorithm powers their feed** and sees a short description of each.

**What they see:**

- **Currently active** — One algorithm is highlighted (e.g. Vocational Upskilling).
- **Available algorithms** — Cards for each: name, description, trust score, popularity. A **Use / Active** button to switch.

**How it works technically:**

- Same APIs as Feed: **`/api/algorithms`** (list), **`/api/algorithms/active`** (current), **`/api/algorithms/toggle`** (set active). The “algorithm” is stored per user in the database (e.g. **UserAlgorithmToggle**). The feed then uses this to decide whether to show education-first or social-first content (in the app this is done in the front-end by reordering mock posts).

---

### Tab 3: Content Curriculum (Scheduler)

**What it is:** The **timetable for your feed**. The student sets **when** the app is in “study mode” (e.g. Vocational Upskilling) and when it’s “social mode” (e.g. Social Discovery). The feed **automatically switches** at those times. This is what fights doomscrolling by design.

**What they see:**

1. **Overview** — Short explanation: “How to manage with social media algorithm change” (schedule by intent, presets, change algorithm per block, calendar, AI suggest).
2. **Timetable presets** — Buttons: **Normal schedule**, **Standard week**, **Exam week**, **Relaxed**, **Intensive study**, **Balance**. Each preset is a “style” of week (e.g. Exam week = more study blocks). Selecting one doesn’t change the stored blocks yet; it’s a preference that the **AI suggest** and copy use.
3. **AI: Suggest my timetable** — Button that calls the AI to **suggest a weekly schedule** (e.g. “Mon 9–12: Vocational Upskilling, Mon 18–22: Social Discovery”). The suggestion appears in a box below. Technically: **`/api/curriculum/suggest`** (POST) sends the current preset to OpenAI and returns text.
4. **Calendar** — **Weekly** view: grid of **time (8:00–20:00)** × **days (Sun–Sat)**. Cells show the **algorithm name** (e.g. Vocational Upskilling) when a schedule block covers that hour. **Monthly** view: classic month calendar with **← / →** to change month; **dots** on days that have schedule blocks (by day of week). Moodle-like: you see “classes” (algorithm blocks) in one place.
5. **This week — based on curriculum** — List of blocks: e.g. “Mon 9:00–12:00” with a **dropdown** to **change the algorithm** for that block (Vocational Upskilling, Social Discovery, Global News, Peer Highlights). When they change it, the app calls **`/api/scheduler/[blockId]`** (PATCH) with the new `algorithmId`, and the list + calendar update.
6. **Switch algorithm by timetable** — Short note that the feed auto-switches by time block.

**How it works technically:**

- **`/api/scheduler?userId=...`** (GET) returns all **ScheduleBlock** rows for that user (each has `dayOfWeek`, `startHour`, `endHour`, `algorithmId`). The app uses this for the list and the weekly calendar.
- **PATCH `/api/scheduler/[blockId]`** with `{ algorithmId }` updates that block’s algorithm in the database.
- On the Feed, a **useEffect** checks the current time: if it falls inside a schedule block, the app can auto-set the active algorithm to that block’s algorithm (so the feed really switches by time).

---

### Tab 4: Wellness

**What it is:** A **mental-health friendly** area: breathing, healthy lifestyle by time of day, quotes, reading, library search, ad themes, music style, community groups.

**What they see:**

- **Breathe** — Short breathing prompt (e.g. 4s in, 4s hold, 6s out) and a Start/Stop button (UI only; no timer logic in the explanation).
- **Healthy lifestyle by time** — Four cards: Morning (exercise: running, fitness, swimming), Afternoon (good diet), Evening (walking), Night (relaxation, sleep). Promotes a routine by time of day.
- **Quotes** — Motivational quotes with **author** (e.g. Steve Jobs, Confucius, Dalai Lama). Stored in the app as a small list.
- **Reading for a better life** — Short blurb on the importance of reading; links to the library search below.
- **City libraries** — **Search box** (e.g. “Search books…”). Below, a list of **mock libraries** (name, address, list of books). Filtered by search term. In production this would call a real library API.
- **Ad themes** — Buttons for Tech, Fashion, Health & fitness, Music, Books & reading, etc. The student can **select/deselect** which themes they want for ads (stored in app state; in production this would be sent to an ad server).
- **Music for your taste** — Buttons for Pop, Indie, Classical, Lo-fi, etc. One selected; “artists can promote their songs here.”
- **Community** — Mock groups (Morning Runners, Book Club, Study Buddies, Wellness Circle) with **Join** and member count. In production this would create real memberships.

**How it works technically:**

- No backend calls for most of this yet: libraries, groups, ad themes, music are **mock data** in the front-end. The structure is there so that later you can plug in real APIs (library catalog, groups, ad preferences, music partners).

---

### Tab 5: University

**What it is:** **Courses and assignments** linked to the student’s institution (Moodle-style).

**What they see:**

- **My courses** — List of courses (title, description, type, enrollment count). Tappable; in production would open course detail.
- **Assignments** — List of assignments (title, course, due date, done/not done). Mock data for now (e.g. “Week 1 Quiz”, “Essay: Feed ranking ethics”).

**How it works technically:**

- **`/api/courses`** (GET) returns courses from the database (e.g. **Course** with **CourseTopic**). Assignments are **mock** in the app. In a full build, assignments would come from a Moodle/LMS API or a local **Assignment** table.

---

### Tab 6: Hub (Digital Asset Hub)

**What it is:** The **wallet and rewards centre**: BTR balance, **student discounts (redeem BTR)**, curriculum badges, AI assistants, creator fashion/skins.

**What they see:**

1. **Bettr Tokens (BTR)** — Current balance (e.g. “42 BTR”). Same as on Feed/Me; comes from **`/api/rewards`**.
2. **Student discounts (redeem BTR)** — List of offers, each with **name**, **description**, **via [Partner]**, and **cost in BTR**, e.g.:
   - Campus café 2-for-1 — 25 BTR — via Campus Café  
   - 10% off Student Beans — 50 BTR — via Student Beans  
   - UNiDAYS 15% off — 75 BTR — via UNiDAYS  
   - Maths textbook voucher — 100 BTR — via Campus Books  
   - Study app premium — 150 BTR — via StudyPro  
   Data from **`/api/discounts`** (database table **StudentDiscount**). Redeem is UI-only for now (no deduction yet).
3. **Curriculum rewards (Open Badges v3)** — Badges earned from the curriculum (e.g. “Academic Progression”). From **`/api/badges?userId=...`** (**UserBadge** + **Badge**).
4. **AI Assistants (LangGraph / CrewAI)** — Cards for **Academic Mentor**, **Exam Prep Coach**, **Nutrition Mentor**, **Career Advisor**. Each card is **clickable**. Clicking opens a **full-screen chat**: the student types questions and the assistant replies with study tips, exam prep, nutrition, or career advice. Technically: **`/api/ai-assistant/chat`** (POST) with `assistantId`, `skillFocus`, and `messages`. The server uses **OpenAI** with a different **system prompt** per assistant (academic, exam, nutrition, career). Replies are shown in the chat; conversation is not persisted yet.
5. **Creator fashion (Metaplex DAS / MPL Core / SPL-404)** — List of digital assets (e.g. “Creator Skin: Midnight”, “Creator Fashion: Campus Blue”). From **`/api/digital-assets`**. In a full build these would link to real NFTs/tokens.

**How it works technically:**

- **`/api/discounts`** — GET; returns **StudentDiscount** rows (name, description, btrCost, partnerName, category).
- **`/api/badges`** — GET with `userId`; returns **UserBadge** with **Badge** (name, focusArea, Open Badges v3–style fields).
- **`/api/ai-assistants`** — GET; list of **AIAssistant** (name, description, skillFocus, pricing).
- **`/api/ai-assistant/chat`** — POST; body: `assistantId`, `assistantName`, `skillFocus`, `messages[]`. Server builds a system prompt from `skillFocus` (academic, exam, nutrition, career, wellness) and calls **OpenAI** (e.g. gpt-4o-mini). Returns `{ message }`.
- **`/api/digital-assets`** — GET; list of **DigitalAsset** (name, type, metaplexUri, etc.).

---

### Tab 7: Me

**What it is:** **Profile and settings**: avatar, name, BTR balance, focus blocks, link to discounts, Content Curriculum summary, Tips & integrations, **Reset BTR (for testing)**, Admin link (if admin), Log out.

**What they see:**

- **Profile** — Initial, display name, @username, Verified badge if they signed in with university.
- **BTR** and **Focus blocks** — Same as on Feed (balance and number of schedule blocks).
- **Student discounts** — Short text: “Redeem BTR in Digital Asset Hub…” and a button **Open Digital Asset Hub** (switches to Hub tab).
- **Content Curriculum (this week)** — Short list of blocks (day, time, algorithm name).
- **Tips & integrations** — Cards explaining: Vocational Upskilling vs Social Discovery, WAYF/university sign-in, Algorithm Marketplace, Bettr Monetization (BTR), Curriculum → Hub, AI Assistants & creator fashion.
- **Testing** — Button: **“Reset BTR & likes (for testing) — earn BTR again by liking pics”**. Clicking it calls **`/api/reset-student`** (POST), which deletes all **RewardEntry** and **EngagementLike** for the current student user. The app then refetches rewards and clears the “liked” state so they can like posts again and earn BTR. Used for demos and testing.
- **Admin Dashboard** — Link (only if the user is an admin) to **`/admin`**.
- **Log out** — Clears session and redirects to login.

**How it works technically:**

- **`/api/reset-student`** (POST): finds the “demo” user (first verified or first user), or uses `?userId=...` if provided. Runs a **transaction** that **deleteMany** on **RewardEntry** and **EngagementLike** for that user. Returns `{ ok: true, userId }`. No UI for redeeming BTR yet (no deduction in database).

---

### Floating AI navigation chatbot

**What it is:** A **lime-green chat button** (bottom-right). Clicking opens a small **chat panel** where the student can type questions like “Where do I redeem BTR?” or “How do I change my feed algorithm?” The bot replies with short instructions (e.g. “Go to the Hub tab → Student discounts”).

**How it works technically:**

- **`/api/chat`** (POST): body `{ messages: [ { role, content } ] }`. Server has a **system prompt** that describes the whole app (Feed, Algorithms, Curriculum, Wellness, University, Hub, Me, login, admin, BTR). It calls **OpenAI** (e.g. gpt-4o-mini) and returns `{ message }`. The front-end appends the reply to the chat. Uses the same **OPENAI_API_KEY** as the AI assistants.

---

### Login

**What it is:** Login page with **email/password** and **“Sign in with university (Jisc/OpenAthens)”**.

- **Email/password** — Demo credentials: **student** / **1234** (student), **admin** / **1234** (admin). Sent to **`/api/auth/login`**; server checks against hardcoded credentials and returns user + role. Stored in **AuthContext** (e.g. localStorage).
- **Sign in with university** — Redirects to **`/api/auth/jisc?action=login`**, which redirects to the institution’s SSO (Jisc/OpenAthens). After login, the IdP redirects back to **`/api/auth/jisc/callback`** with a SAML response. The server parses it (or in demo mode accepts a mock) and creates/updates the user with **eduPersonPrincipalName**, **eduPersonAffiliation**, and sets **isVerified**. Then redirects to the app. If Jisc/OpenAthens isn’t configured, the app shows a friendly “not configured” message.

**How it works technically:**

- **`/api/auth/login`** — POST; body `{ username, password }`. Compares to demo users; returns `{ user: { username, role } }`.
- **`/api/auth/jisc`** — GET; `?action=metadata` returns SAML SP metadata; `?action=login` redirects to **JISC_SSO_URL** (or OPENATHENS).
- **`/api/auth/jisc/callback`** — POST (SAML ACS); reads SAML assertion, extracts identity/affiliation, upserts **User**, sets session, redirects to `/`.

---

## Part 3: Admin Interface — What Each Part Does

Admins go to **`/admin`** (e.g. `http://localhost:3000/admin`). They must be logged in as **admin** (e.g. admin/1234).

### Admin layout

- **Sidebar** — Links to Dashboard, Bounty areas (Identity, Algorithms, Scheduler, Curriculum, Monetization, AI & Digital Asset Hub), Courses, Workspaces, Language courses, Marketplace, Rewards, Scheduler, Curriculum, Settings, Verify.
- **Top bar** — “Main app” link (back to student app), user menu.
- **Content area** — Each link opens a page; many show **live preview** of the student app in a phone frame (AdminPreviewPhoneFrame).

---

### Admin Dashboard (Bounties overview)

**What it is:** **`/admin`** or **`/admin/dashboard`**. Shows **Bounties overview**: cards for each bounty (e.g. Scheduled feeds, Curriculum, Monetization, AI & Digital Asset Hub) with **counts** (e.g. schedule blocks, badges, rewards, assistants, assets). Links go to the detailed dashboard pages below.

**How it works technically:** Reads from the database (e.g. **ScheduleBlock**, **Badge**, **RewardEntry**, **AIAssistant**, **DigitalAsset**) and displays counts. No “forest” skin; digital assets are whatever is in the DB (e.g. “Creator Skin: Midnight”, “Creator Fashion: Campus Blue” after seed).

---

### Bounty 1: Identity (Institutional Identity and Global Student Onboarding)

**What it is:** **`/admin/dashboard/identity`**. Shows **verified user count**, **universities count**, **federation metadata count**, and a **University registry** table (entity ID, name, metadata URL). Used to see which institutions are connected and how many students are verified.

**How it works technically:** **University**, **FederationMetadata**, **User** (isVerified, eduPersonPrincipalName, eduPersonAffiliation). No direct “forest” reference; uses **bettr-forest** only as a green colour for headings/numbers.

---

### Bounty 2: Algorithms (Decentralized Algorithm Marketplace)

**What it is:** **`/admin/dashboard/algorithms`**. Lists **algorithms** (e.g. Vocational Upskilling, Social Discovery, Global News, Peer Highlights) with name, description, intent, popularity, trust score, and optional IPFS/Solana metadata.

**How it works technically:** **Algorithm** table; **`/api/algorithms`** used by the app. Admin page reads from DB (e.g. prisma.algorithm.findMany). **bettr-forest** is used for styling only.

---

### Bounty 3: Scheduler (Algorithmic Productivity and Wellness Scheduler)

**What it is:** **`/admin/dashboard/scheduler`**. Shows **count of schedule blocks** and a **list of recent schedule blocks** (user, algorithm, day, time range). Admins can see what students have configured; actual block creation is often done by the student in the app or by a future admin form.

**How it works technically:** **ScheduleBlock** (userId, algorithmId, dayOfWeek, startHour, endHour, label). **`/api/scheduler`** GET/POST used by the student app; PATCH on **`/api/scheduler/[blockId]`** to change algorithm. No “forest skin” here.

---

### Bounty 4: Monetization (Bettr Monetization Engine)

**What it is:** **`/admin/dashboard/monetization`**. Shows **payout total**, **reward count**, and **Recent reward ledger** (user, reason, points, time). Lets admins see BTR distribution and reward history.

**How it works technically:** **RewardEntry** (userId, reason, points, txSignature). **bettr-forest** is only a colour for headings/numbers.

---

### Bounty 5: Badges (Curriculum of Content — Gamified Education)

**What it is:** **`/admin/dashboard/badges`**. Shows **badge counts**, **leaderboard** (users with most badges), and **list of badges** (name, focus area, Open Badges/ESCO style). Used to manage curriculum badges that appear in the student Hub.

**How it works technically:** **Badge**, **UserBadge**; **`/api/badges`** for the student app. Styling uses **bettr-forest** for titles/numbers.

---

### Bounty 6: AI Assistant & Digital Asset Hub

**What it is:** **`/admin/dashboard/ai-assets`**. Shows **AI assistants count**, **digital assets count**, and tables: **AI Assistants** (name, description, skill focus, pricing) and **Digital assets** (name, type, metaplex URI, etc.). These are the same assistants and assets that appear in the student **Hub** (e.g. Academic Mentor, Creator Skin: Midnight, Creator Fashion: Campus Blue). No “Forest” skin in seed anymore; only “Midnight” and “Campus Blue” (or whatever is in the DB).

**How it works technically:** **AIAssistant**, **DigitalAsset**; **`/api/ai-assistants`**, **`/api/digital-assets`**, **`/api/ai-assistant/chat`**. **bettr-forest** is only used for styling.

---

### Other admin pages

- **Courses (Moodle-like)** — **`/admin/dashboard/courses`**. Lists courses; links to curriculum/course management.
- **Workspaces** — **`/admin/dashboard/workspaces`**. University collaboration / shared workspaces.
- **Language courses** — **`/admin/dashboard/language-courses`**. Duolingo-style language courses.
- **Rewards** — **`/admin/rewards`**. Reward ledger / payouts.
- **Scheduler** — **`/admin/scheduler`**. Another view of schedule management.
- **Curriculum** — **`/admin/curriculum`**. Curriculum configuration.
- **Marketplace** — **`/admin/marketplace`**. Marketplace overview; **bettr-forest** used as colour.
- **Settings** — **`/admin/settings`**. App/site settings.
- **Verify** — **`/admin/verify`**. Verification workflows.

All of these use **bettr-forest** only as the **green colour** for headings, links, and numbers in the admin theme. There is **no “forest skin”** product or text left in the admin or app; the only “skin” in the seed is **“Creator Skin: Midnight”** (Forest was removed).

---

## Part 4: Technical Concepts in Simple Terms

- **Algorithm** — A “recipe” for ordering the feed (e.g. education first vs social first). Stored in the DB; the student picks one and the app uses it to reorder or filter posts.
- **BTR (Bettr Tokens)** — In-app points. Stored as **RewardEntry** rows (each has `points`). Balance = sum of points for that user. Earned by liking posts; spent (in the future) on student discounts.
- **Content Curriculum** — The set of **ScheduleBlock** rows: for each block you have a day, time range, and algorithm. The feed “follows” the block that matches the current time.
- **EngagementLike** — One row per (user, post) when they like a post. Prevents double BTR for the same like; used by **`/api/engagement/like`**.
- **Open Badges v3 / ESCO** — Standards for skills and credentials. Badges in the DB can hold Open Badges JSON and ESCO skill IDs; shown in the Hub as “Curriculum rewards.”
- **Jisc / OpenAthens** — UK/international standards for university sign-in. The app redirects to the uni’s login page and gets back an identity (SAML); then it creates or updates the user and marks them verified.
- **Metaplex / MPL Core / SPL-404** — Blockchain/NFT standards. The **DigitalAsset** table has fields like **metaplexUri** and **spl404Mint** so that in the future assets in the Hub can link to real NFTs/tokens.
- **LangGraph / CrewAI** — Frameworks for AI agents. The app uses **OpenAI** with different system prompts per AI assistant (Academic, Exam, Nutrition, Career); the “agentic” idea is that each assistant has a clear role and memory could be added later.

---

## Part 5: Summary Table — Student vs Admin

| Area | Student interface | Admin interface |
|------|-------------------|------------------|
| **Feed** | See posts; switch algorithm; like to earn BTR; see BTR balance. | No direct feed management; can see rewards in Monetization. |
| **Algorithms** | Choose active algorithm (Marketplace). | View/edit algorithm list (Bounty 2). |
| **Curriculum / Scheduler** | Set presets; see calendar; change algorithm per block; AI suggest timetable. | View schedule blocks (Bounty 3); scheduler pages. |
| **Wellness** | Breathing; lifestyle by time; quotes; libraries; ad/music preferences; groups. | Not in admin. |
| **University** | Courses and assignments (Moodle-style). | Courses, workspaces, language courses. |
| **Hub** | BTR; discounts; badges; AI assistants (chat); creator fashion. | AI assets & digital assets (Bounty 6); rewards. |
| **Me** | Profile; BTR; reset BTR (testing); tips; admin link; log out. | — |
| **Login** | Email/password or university SSO. | Same login; role “admin” gives access to /admin. |
| **Extra** | AI nav chatbot; DMs dropdown. | Dashboard overview; verify; settings. |

---

This document is the **single explanation script** for going through the app and admin: what each part does, how it’s different from normal social media, what’s added, and how it works technically in non-technical language.
