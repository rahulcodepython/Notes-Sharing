# Notes Sharing

Students sign in with Google, join or create communities, and share notes stored in their own Google Drive. See `docs/PLAN.md`.

## Setup

```bash
bun install
cp .env.example .env    # fill BETTER_AUTH_SECRET and the Google credentials
bun run db:up           # Postgres 17 in Docker
bun run db:migrate
bun run dev
```

## Scripts

- `db:generate`: create a migration after editing `src/db/schema.ts`
- `db:migrate`: apply migrations
- `db:studio`: open Drizzle Studio
- `typecheck`, `lint`, `build`
