# Run Bettr Admin

## First-time setup

1. **Environment**
   - Copy `.env.example` to `.env`
   - On Windows: `copy .env.example .env`
   - On macOS/Linux: `cp .env.example .env`
   - This sets `DATABASE_URL="file:./dev.db"` (SQLite)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database** (creates DB, runs seed)
   ```bash
   npm run setup
   ```
   Or step by step: `npx prisma generate` → `npx prisma db push` → `npx prisma db seed`

4. **Start the app**
   ```bash
   npm run dev
   ```

5. Open **http://localhost:3000** — you should see the admin dashboard.

## If something fails

- **"PrismaClient is unable to run in the browser"** — run `npx prisma generate` and restart the dev server.
- **"Can't reach database server"** — ensure `.env` exists and contains `DATABASE_URL="file:./dev.db"`. Run `npx prisma db push` to create the DB file.
- **Blank or error on load** — run `npx prisma db seed` to add sample data, then refresh.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production (runs `prisma generate` first) |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB (no migrations) |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
