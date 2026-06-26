# Random Quote Generator — DevOps Practice Project

A deliberately simple full-stack app: click a button, backend fetches a random
quote from PostgreSQL, frontend displays it. The application logic is done.
Containerizing, orchestrating, and pipelining it is on you.

## What's in this zip

```
quote-app/
├── backend/
│   ├── server.js        # Express server: serves frontend + /api/quote + /health
│   ├── db.js             # PostgreSQL connection pool (reads config from env vars)
│   ├── package.json
│   ├── .env.example       # copy to .env for local runs
│   └── public/
│       └── index.html    # single page, one button, vanilla JS fetch()
├── db/
│   └── init.sql           # schema + 10 seed quotes
└── .gitignore
```

## What I actually verified (and what I didn't)

I don't have PostgreSQL available in my own sandbox, so be clear-eyed about
what's confirmed vs. assumed:

**Verified:**
- `npm install` resolves cleanly, no dependency conflicts
- Server boots without errors
- `/health` correctly returns `503` with a clear error when DB is unreachable
- Static frontend serves correctly on `200`
- JS syntax is valid in both `server.js` and `db.js`

**Not verified (you need to test this yourself once Postgres is up):**
- `/api/quote` actually returning a row — this requires a live DB connection,
  which I can't spin up here. The SQL in `init.sql` is standard and should work,
  but "should work" and "verified" are different claims. Test it.

## Running it locally (no Docker, just to sanity-check the app itself)

You'll need PostgreSQL installed locally first.

```bash
# 1. Create DB and load schema
psql -U postgres -c "CREATE DATABASE quotedb;"
psql -U postgres -c "CREATE USER quoteuser WITH PASSWORD 'quotepass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE quotedb TO quoteuser;"
psql -U quoteuser -d quotedb -f db/init.sql

# 2. Run the backend
cd backend
cp .env.example .env
npm install
npm start

# 3. Open http://localhost:3000
```

If the button click doesn't return a quote, check your DB credentials in `.env`
match what you created in step 1. That's the most common failure point.

## What you're building from here (intentionally not included)

You said you want to write these yourself, so I haven't touched them. Here's
what each one needs to actually do, so you know what "done" looks like:

1. **Dockerfile** (backend) — needs to: use a node base image, copy package
   files, `npm install`, copy source, expose the port, run `node server.js`.
   Don't `COPY . .` before `npm install` or you lose Docker's layer caching.

2. **Dockerfile or official image** (Postgres) — you can likely just use the
   official `postgres` image and mount `db/init.sql` into
   `/docker-entrypoint-initdb.d/` — Postgres images auto-run `.sql` files
   placed there on first boot.

3. **docker-compose.yml** — two services (`backend`, `db`), a network between
   them, a named volume for Postgres data persistence, and env vars matching
   `.env.example`. Test that `docker-compose down && docker-compose up`
   doesn't wipe your quotes (volume persistence is the actual lesson here).

4. **CI/CD pipeline** (GitHub Actions) — at minimum: lint/install on push,
   build the Docker image, maybe push to a registry. Don't overbuild this
   on attempt one — get a green checkmark on something trivial first.

5. **K8s manifests** (if/when you get there) — Deployment + Service for
   backend, StatefulSet or Deployment+PVC for Postgres, a ConfigMap/Secret
   for env vars instead of hardcoding them. This is where most people
   realize env-var management was the actual hard part of steps 1-3.

## One thing worth flagging before you start

Storing `DB_PASSWORD=quotepass` in plaintext `.env` is fine for this practice
project but is exactly the habit that gets people in trouble later. When you
get to the Secrets step in K8s, treat it as the actual lesson, not boilerplate
to copy-paste past.
