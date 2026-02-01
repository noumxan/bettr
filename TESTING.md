# How to Test Your Deployed Bettr App

Deployment is successful. Use this checklist to test the live app.

---

## 1. Get your URL

- In **Railway** → your service → **Settings** → **Networking** (or **Domains**).
- Copy the public URL (e.g. `https://your-app.up.railway.app`).

---

## 2. Database (one-time)

If you see “Could not load”, blank data, or DB errors, set up the database once:

**Option A — Railway CLI**

```bash
railway login
railway link   # choose your Bettr project/service
railway run npx prisma db push
railway run npx prisma db seed
```

**Option B — Railway dashboard**

- In your service, open **Shell** or **One-off command** (if available).
- Run: `npx prisma db push && npx prisma db seed`

Then refresh the app. You should see demo data (algorithms, schedule, rewards, badges, etc.).

---

## 3. Log in

Open your deployed URL. You should see the **login** page.

| Who     | Username | Password | Where it goes      |
|--------|----------|----------|--------------------|
| Student | `student` | `1234`   | Student app (home) |
| Admin   | `admin`   | `1234`   | Admin dashboard   |

- Log in as **student** / **1234** → you land on the main student app.
- Log out (if the UI has a logout), then log in as **admin** / **1234** → you land on `/admin`.

---

## 4. Test as a student

After logging in as **student**:

1. **Home / Feed** — See feed and algorithm toggles (Study mode vs Social). Switch and confirm the feed order changes.
2. **Content Curriculum** — See weekly schedule blocks; change an algorithm per block (dropdown); try “AI: Suggest my timetable” if `OPENAI_API_KEY` is set.
3. **Wellness** — Breathe exercise, healthy-lifestyle cards, quotes, reading section, ad themes, music, community (UI only / mock).
4. **Digital Asset Hub** — Discounts (BTR cost, partner), AI Assistants (click one → chat modal; needs `OPENAI_API_KEY` for real replies), digital assets.
5. **Me** — Points/rewards, badges, “Reset BTR & likes (for testing)”, link to Hub for discounts.

Check that:

- Algorithms load and toggles work.
- Scheduler loads and you can change a block’s algorithm.
- Rewards/points and badges appear (from seed).
- No console/network errors for the main API calls.

---

## 5. Test as admin

After logging in as **admin** (you should be at `/admin`):

1. **Dashboard** — KPIs: verified students, algorithms, scheduled feeds, payout total, badges, AI & assets.
2. **Identity** — Universities, verified count, federation metadata.
3. **Algorithms** — List of algorithms with popularity/trust.
4. **Scheduler** — All schedule blocks, users, days, times.
5. **Monetization / Rewards** — Payout total, recent reward entries.
6. **Badges** — Badge definitions, leaderboard.
7. **AI & Assets** — AI Assistants, Digital Assets.
8. **Courses, Language courses, Workspaces** — Lists from DB.
9. **Collaboration** — Workspaces.
10. **Curriculum** — Badges and courses.
11. **Marketplace** — Algorithms; **Marketplace → AI** — Assistants and assets.
12. **Verify** — Universities and metadata.

Confirm pages load without “Could not load” or 500s. Data should match seed (e.g. one demo user, a few algorithms, schedule blocks, reward entries).

---

## 6. Optional: AI features

- **Navigation chatbot** and **AI Assistant chats** need `OPENAI_API_KEY` set in Railway **Variables**.
- If the key is missing, those features may no-op or show a generic message; the rest of the app should still work.

---

## 7. Quick checklist

| Step | Action |
|------|--------|
| 1 | Open deployed URL |
| 2 | If needed, run `prisma db push` + `prisma db seed` once |
| 3 | Log in as **student** / **1234** and click through Feed, Curriculum, Wellness, Hub, Me |
| 4 | Log in as **admin** / **1234** and open Dashboard, Identity, Algorithms, Scheduler, Rewards, etc. |
| 5 | Optionally set `OPENAI_API_KEY` and test chatbot + AI Assistant chats |

If something fails, check **Railway logs** (service → **Deployments** → latest → **View logs**) and **browser DevTools** (Console + Network) for errors.
