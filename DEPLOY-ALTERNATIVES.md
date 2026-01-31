# Deploy Bettr Without Changing to PostgreSQL (Keep SQLite)

If you want to **keep the app as it is** — including **SQLite** (`file:./dev.db`) — you can deploy to platforms that support **persistent storage** or a **long‑running server**. Vercel’s serverless model doesn’t support SQLite, so use one of the options below.

---

## Why Vercel Doesn’t Work With SQLite

- Vercel runs **serverless functions**: each request can hit a different, short‑lived container.
- The filesystem is **read‑only** (except `/tmp`, which is cleared between runs).
- SQLite needs a **single, writable file** that persists. That doesn’t fit Vercel’s model, so **Vercel + SQLite isn’t supported**. To use Vercel you’d need to switch to PostgreSQL (see `DEPLOY-VERCEL.md`).

---

## Option 1: Railway

**Works with SQLite** by using a **persistent volume** for the database file.

1. Sign up at [railway.app](https://railway.app) and create a new project.
2. Connect your GitHub repo and add a **Web Service**.
3. Add a **Volume** and mount it (e.g. `/data`). Put the SQLite file there: set **DATABASE_URL** to `file:/data/dev.db` (or similar path inside the volume).
4. **Build:** `npm install && npx prisma generate && npm run build`
5. **Start:** `npm run start`
6. Set **Environment Variables:** `DATABASE_URL=file:/data/dev.db` (and `OPENAI_API_KEY` if you use AI). Run **prisma db push** and **prisma db seed** once (e.g. via a one‑off command or SSH into the service).
7. Deploy. Railway keeps the volume across restarts, so your SQLite data persists.

**Docs:** [Railway Volumes](https://docs.railway.app/reference/volumes)

---

## Option 2: Render

**Works with SQLite** if you use a **persistent disk** (paid feature on Render) or run the app as a **background worker / web service** with a disk.

1. Sign up at [render.com](https://render.com) and create a **Web Service** from your repo.
2. **Build:** `npm install && npx prisma generate && npm run build`
3. **Start:** `npm run start`
4. For **persistent SQLite**, attach a **Disk** (Render → your service → Disk) and set **DATABASE_URL** to a path on that disk (e.g. `/data/dev.db`). Run **prisma db push** and **prisma db seed** once (e.g. via Shell or a one‑off job).
5. Set env vars (**DATABASE_URL**, **OPENAI_API_KEY** optional) and deploy.

**Note:** Render’s free tier doesn’t include persistent disk; you need a paid plan for a writable disk that survives restarts. Without a disk, the app will run but the SQLite file may be lost on redeploy.

---

## Option 3: Fly.io

**Works with SQLite** using a **volume** for the database file.

1. Sign up at [fly.io](https://fly.io) and install the CLI.
2. From your project: `fly launch` (create app, don’t add Postgres).
3. Create a volume: `fly volumes create data --size 1`
4. In `fly.toml` (or via dashboard), mount the volume (e.g. `/data`) and set **DATABASE_URL** to `file:/data/dev.db`.
5. **Build / start:** same as above; run **prisma db push** and **prisma db seed** once (e.g. `fly ssh console` then run the commands).
6. Set env vars and deploy: `fly deploy`.

**Docs:** [Fly Volumes](https://fly.io/docs/reference/volumes/)

---

## Option 4: VPS (DigitalOcean, Linode, etc.)

**Works with SQLite** with no changes: you have a normal server and a writable filesystem.

1. Create a **Droplet** (DigitalOcean) or VM (e.g. Ubuntu).
2. Install **Node.js** (e.g. via [nodejs.org](https://nodejs.org) or `nvm`).
3. Clone your repo and set **DATABASE_URL** in `.env` to `file:./dev.db` (or an absolute path like `/var/app/prisma/dev.db`).
4. Run:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   npm run build
   npm run start
   ```
5. Use **PM2** or **systemd** to keep `npm run start` running and to restart on reboot.
6. Put a **reverse proxy** (e.g. Nginx) in front and add SSL (e.g. Let’s Encrypt).

You keep the app and SQLite exactly as they are; no Postgres required.

---

## Option 5: Docker (any host)

**Works with SQLite** by storing the database file in a **Docker volume** so it persists.

1. Add a **Dockerfile** (example below).
2. Build: `docker build -t bettr .`
3. Run with a volume for the DB:  
   `docker run -p 3000:3000 -v bettr-data:/app/prisma bettr`  
   and set **DATABASE_URL** inside the container to a path inside `/app/prisma` (e.g. `file:/app/prisma/dev.db`) so it writes to the volume.
4. Run **prisma db push** and **prisma db seed** once inside the container (e.g. `docker exec ...`).

You can run this Docker image on Railway, Render, Fly.io, a VPS, or any host that runs Docker.

**Minimal Dockerfile example:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate && npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Adjust `COPY` and paths if your SQLite file lives in a volume mount at runtime.

---

## Summary

| Platform   | Keeps SQLite? | Notes                                      |
|-----------|----------------|--------------------------------------------|
| **Vercel** | No             | Needs PostgreSQL; see `DEPLOY-VERCEL.md`.  |
| **Railway** | Yes            | Use a volume; set DATABASE_URL to volume path. |
| **Render**  | Yes            | Use a persistent disk (paid); set DATABASE_URL on disk. |
| **Fly.io**  | Yes            | Use a volume; set DATABASE_URL to volume path. |
| **VPS**     | Yes            | Normal server; SQLite as-is.                |
| **Docker**  | Yes            | Use a volume for the DB file.               |

To **keep the app as it is** (including SQLite), use **Railway**, **Fly.io**, a **VPS**, or **Docker** with a volume. Use **Vercel** only if you’re okay switching to PostgreSQL (and then follow `DEPLOY-VERCEL.md`).
