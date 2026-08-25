# Shopfront (learning project)

Angular + NestJS + Postgres. No ORM — the backend talks to Postgres directly
via the `pg` driver with hand-written parameterized SQL, on purpose.

## Layout

- `backend/` — NestJS API (port 3000)
- `frontend/` — Angular app (port 4200)
- `backend/sql/schema.sql` — hand-written DDL, applied by hand via `psql`
- `backend/sql/seed.sql` — sample catalog data

## Prerequisites

- Postgres running locally on port 5432. This was built against Postgres 18
  installed via Homebrew (`brew services start postgresql@18`).
- A `shopfront` database owned by a `shopfront_dev` role (see "Database setup"
  below if you're setting this up fresh elsewhere).

## Database setup

```bash
psql -U postgres -c "CREATE ROLE shopfront_dev WITH LOGIN PASSWORD 'shopfront_dev' CREATEDB;"
psql -U postgres -c "CREATE DATABASE shopfront OWNER shopfront_dev;"

cd backend
PGPASSWORD=shopfront_dev psql -U shopfront_dev -h localhost -d shopfront -f sql/schema.sql
PGPASSWORD=shopfront_dev psql -U shopfront_dev -h localhost -d shopfront -f sql/seed.sql
```

## Running

```bash
# backend
cd backend
cp .env.example .env   # already matches the role/db above — edit if yours differ
npm install
npm run start:dev      # http://localhost:3000

# frontend, in a second terminal
cd frontend
npm install
npx ng serve            # http://localhost:4200
```

Check `http://localhost:3000/health` for `{"status":"ok","database":"connected"}`,
then `http://localhost:4200` for the catalog page.

## What's built vs. what's yours to build

This is a skeleton, not a finished app — deliberately. Built so far:

- Postgres schema for `categories` / `products` / `product_variants`
- A `ProductsModule` in Nest as a worked example of the raw-SQL pattern:
  repository (parameterized queries) → service (maps DB rows to API shape) →
  controller. `GET /products`, `GET /products/:slug`.
- A minimal Angular `Catalog` component consuming it via `HttpClient` +
  signals (`toSignal`), proving the frontend/backend wiring works.

Not built — this is the actual exercise:

- Auth (JWT + Passport, password hashing)
- Cart and checkout, including the stock-decrement race condition worth
  deliberately reproducing and then fixing with a transaction + row lock
- Order history / order state machine
- A real catalog UI (search, filtering, product detail pages, styling)
- Tests beyond the one health-check spec
