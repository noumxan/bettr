# Deploy Bettr to Railway (Step-by-Step)

This guide walks you through deploying Bettr to **Railway** with **SQLite** (no PostgreSQL). Your app stays as it is.

---

## What you need

- A **GitHub** account with the Bettr repo pushed.
- A **Railway** account: [railway.app](https://railway.app) — sign in with GitHub.

---

## Step 1 — Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project**.
3. Choose **Deploy from GitHub repo**.
4. Select your **Bettr** repository. If it’s not listed, click **Configure GitHub App** and allow Railway access to the repo, then try again.
5. Railway will create a project and add a **service** from the repo.

---

## Step 2 — Add a volume (for SQLite)

SQLite needs a **persistent disk**. Railway uses **Volumes** for that.

1. In your project, click the **service** (your app).
2. Open the **Variables** tab (or **Settings**).
3. Go to the **Volumes** section (or **Settings** → **Volumes**).
4. Click **Add Volume** (or **New Volume**).
5. Set the **mount path** to: **`/data`**
6. Create the volume. Railway will mount it at `/data` so the app can store the SQLite file there.

---

## Step 3 — Set environment variables

1. In the service, open **Variables** (or **Environment**).
2. Add:

   | Variable          | Value                 |
   |-------------------|------------------------|
   | `DATABASE_URL`    | `file:/data/dev.db`   |
   | `OPENAI_API_KEY`  | Your OpenAI key (optional; for chatbot and AI assistants) |

3. Save. Railway will use these when building and running the app.

---

## Step 4 — Set build and start commands

1. In the service, go to **Settings** (or the **Deploy** tab).
2. **Build Command** — set to:
   ```bash
   npm install && npx prisma generate && npm run build
   ```
   (Or leave default if Railway already runs `npm run build`; ensure it runs `prisma generate` before `next build`, which your `package.json` already does.)
3. **Start Command** — set to **one of**:
   - **Recommended (seed DB on every deploy):**
     ```bash
     npm run deploy:railway
     ```
     This runs `prisma db push` and `prisma db seed` inside Railway (so algorithms and demo data exist), then starts the app. Safe to use every time; the seed is idempotent.
   - **Faster start (after DB is already set up):**
     ```bash
     npm run start:railway
     ```
     Or: `npx next start -p $PORT`
4. **Root Directory** — leave blank (or `.`) if the app is at the repo root.
5. Save.

---

## Step 5 — Deploy

1. Click **Deploy** (or push a commit; Railway will redeploy).
2. Wait for the build to finish. The first deploy will succeed but the app may show “Could not load” or DB errors until the database is set up (Step 6).

---

## Step 6 — Create the database (one-time)

Railway does **not** run `prisma db push` or `prisma db seed` for you. You run them once so the SQLite file on the volume has tables and demo data.

**Option A — Railway CLI (recommended)**

1. Install the Railway CLI: [docs.railway.app/develop/cli](https://docs.railway.app/develop/cli)
2. Log in: `railway login`
3. In your Bettr folder, link the project: `railway link` (choose the project and service).
4. Run the setup in the Railway environment (so it uses the volume):
   ```bash
   railway run npx prisma db push
   railway run npx prisma db seed
   ```
   This uses the service’s `DATABASE_URL` (`file:/data/dev.db`) and writes to the volume.

**Option B — One-off run in Railway dashboard**

1. In Railway, open your service.
2. If Railway offers a **Shell** or **One-off command**, run:
   ```bash
   npx prisma db push && npx prisma db seed
   ```
   (Only if the shell runs in the same environment as the app and has access to the volume.)

After this, the SQLite file at `/data/dev.db` on the volume has all tables and seed data. Restart or redeploy the app if needed; the app should then load correctly.

---

## Step 7 — Get your URL

1. In the service, open **Settings** → **Networking** (or **Domains**).
2. Click **Generate Domain** (or **Add domain**). Railway will give you a URL like `https://your-app.up.railway.app`.
3. Open that URL in a browser. You should see the Bettr login page.
4. Log in with **student** / **1234** (student app) or **admin** / **1234** (admin dashboard at `/admin`).

---

## Summary

| Step | What to do |
|------|------------|
| 1 | Create a Railway project from your GitHub repo. |
| 2 | Add a Volume with mount path **`/data`**. |
| 3 | Set **DATABASE_URL** = `file:/data/dev.db` and (optional) **OPENAI_API_KEY**. |
| 4 | Set **Start Command** to `npm run start:railway` (or `npx next start -p $PORT`). |
| 5 | Deploy. |
| 6 | Run **prisma db push** and **prisma db seed** once (e.g. `railway run npx prisma db push` then `railway run npx prisma db seed`). |
| 7 | Open the generated URL and log in. |

---

## Troubleshooting

- **“Could not load” or DB errors:** Make sure you ran **prisma db push** and **prisma db seed** once (Step 6) using the same `DATABASE_URL` (e.g. via `railway run`).
- **Build fails:** Check that **Build Command** runs `npm install`, `npx prisma generate`, and `npm run build`. Your `package.json` already has `"build": "prisma generate && next build"`, so the default build that runs `npm run build` should be enough.
- **App doesn’t respond / wrong port:** Set **Start Command** to `npm run start:railway` or `npx next start -p $PORT` so the app listens on Railway’s `PORT`.
- **Data lost after redeploy:** The SQLite file must be on the **volume** at `/data`. Confirm **DATABASE_URL** is `file:/data/dev.db` and the volume is mounted at `/data`.

---

## Optional: custom domain and Jisc/SSO

- **Custom domain:** In Railway → service → **Settings** → **Networking**, add your domain and point DNS as instructed.
- **University sign-in (Jisc/OpenAthens):** Add **JISC_ENTITY_ID**, **JISC_SSO_URL**, and **NEXT_PUBLIC_APP_URL** (your Railway URL or custom domain) in **Variables**, then configure your IdP to use that URL for callbacks.

You’re done. Bettr runs on Railway with SQLite as it is.
